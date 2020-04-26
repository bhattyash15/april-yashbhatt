/*
 * @author Gaurav Kumar
 */

const User = require('../models/user');
const Project = require('../models/project');
const Profile = require('../models/profile');
const VieuthMailer = require('../util/vieuth-mailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

const resolvers = {
    Query: {
        allUsers: (parent, {page = 1, limit = 10}, context) => {
            if (context.isAuthenticated()) {
                let user = context.getUser();
                if (user.role === 'admin' || user.role === 'super_admin' || true)
                    return User.paginate({}, {page: page, limit: limit, populate: 'profile'})
                        .then(result => {
                            return result;
                        })
                        .catch(e => {
                            console.log(e);
                            return e;
                        });
                else
                    return new Error("Unauthorized access");
            } else {
                return new Error("Unauthorized access");
            }
        },
        allProjects: (parent, {page = 1, limit = 10}, context) => {
            return Project.paginate({}, {page: page, limit: limit, populate: 'user'})
                .then(result => {
                    return result;
                })
                .catch(e => {
                    console.log(e);
                    return e;
                })
        }
    },
    Mutation: {
        updateUserProfile: (root, {id, input}, context) => {
            if (context.isAuthenticated()) {
                let user = context.getUser();
                if (user._id == id) {
                    // return Profile.findById(input._id)
                    //     .then(profile => {
                    //         if (profile && context.getUser()._id === input.user._id) {
                    //             profile.fullName = input.fName + ' ' + input.lName;
                    //             profile.fName = input.fName;
                    //             profile.lName = input.lName;
                    //             profile.profilePicUrl = input.profilePicUrl;
                    //             profile.dob = input.dob;
                    //             profile.gender = input.gender;
                    //             profile.college = input.college;
                    //             profile.university = input.university;
                    //             profile.branch = input.branch;
                    //             profile.degree = input.degree;
                    //             profile.tags = input.tags;
                    //             profile.contact = input.contact;
                    //             return profile.save()
                    //                 .then(updatedProfile => updatedProfile)
                    //                 .catch(e => {
                    //                     console.log(e);
                    //                     return e;
                    //                 })
                    //         }
                    //     })
                } else {
                    return new Error('User is not authenticated for this action');
                }

            } else {
                return new Error('User is not authenticated for this action');
            }
        },
        registerUser: (root, {input}, context) => {
            return User.findOne({email: input.email})
                .then(u => {
                    if (u) {
                        console.log("user exist with this email");
                        return new Error("User exists with this email");
                    } else {

                        let newUser = new User(input);
                        newUser.password = bcrypt.hashSync(input.password, bcrypt.genSaltSync(10));

                        let token = jwt.sign({
                            id: newUser._id,
                            email: newUser.email
                        }, config.jwt.secret, {expiresIn: config.jwt.expiresIn});
                        newUser.verificationToken = token;
                        return newUser.save()
                            .then(user => {
                                let profile = new Profile(input);
                                profile.user = user;
                                profile.fullName = profile.fName + ' ' + profile.lName;
                                profile.contact = {
                                    email: user.email,
                                    mobile: user.mobile
                                };
                                return profile.save()
                                    .then(savedProfile => {
                                        /* Send email verfication link to their email*/

                                        VieuthMailer.sendVerificationEmail(user.email, user.verificationToken);
                                        user.profile = savedProfile;
                                        user.save();
                                        return savedProfile;

                                    })
                                    .catch(e => {
                                        console.log(e);
                                        return e;
                                    })
                            })
                            .catch(e => {
                                console.log(e);
                                return e;
                            })
                    }
                })
                .catch(e => {
                    console.log(e);
                    return e;
                })

        },
        sendEmailVerificationCode: (root, {input}, context) => {
            if (context.isAuthenticated()) {
                let user = context.getUser();
                let token = jwt.sign({
                    id: user._id,
                    email: user.email
                }, config.jwt.secret, {expiresIn: config.jwt.expiresIn});
                user.verificationToken = token;
                user.save();
                VieuthMailer.sendVerificationEmail(user.email, user.verificationToken);
                return true;
            } else if (input !== undefined) {
                return User.findOne({email: input})
                    .then(user => {
                        if (user) {
                            if (user.verified) {
                                return new Error('User is verified already');
                            } else {
                                let token = jwt.sign({
                                    id: user._id,
                                    email: user.email
                                }, config.jwt.secret, {expiresIn: config.jwt.expiresIn});
                                user.verificationToken = token;
                                user.save();
                                VieuthMailer.sendVerificationEmail(user.email, token);
                                return true;
                            }
                        } else {
                            console.log('user not found for this email');
                            return false;
                        }
                    })
                    .catch(e => {
                        console.log(e);
                        return e;
                    })
            } else {
                return new Error("User not authenticated for this action");
            }
        },
        verifyUserEmail: (root, {input}, context) => {
            if (context.isAuthenticated()) {
                let user = context.getUser();
                if (user.verificationToken === input) {
                    return jwt.verify(input, config.jwt.secret, function (err, decoded) {
                        if (err) {
                            return err;
                        }
                        if (decoded._id === user._id && decoded.email === user.email) {
                            user.verified = true;
                            return user.save()
                                .then(verifiedUser => verifiedUser)
                                .catch(e => {
                                    console.log(e);
                                    return e;
                                })
                        }
                    });
                } else {
                    return new Error('Verification token is not for this user.');
                }
            } else {
                return jwt.verify(input, config.jwt.secret, function (err, decoded) {
                    if (err) {
                        return err;
                    }
                    return User.findById(decoded.id)
                        .then(user => {
                            if (decoded.email === user.email && input === user.verificationToken) {
                                user.verified = true;
                                return user.save()
                                    .then(verifiedUser => {
                                        return verifiedUser;
                                    })
                                    .catch(e => {
                                        console.log(e);
                                        return e;
                                    })
                            } else {
                                return new Error('Verification token is not for this user.');
                            }
                        })
                        .catch(e => {
                            console.log(e);
                            return e;
                        })
                });
            }
        },
        login: async (root, {input: {email, password}}, context) => {
            if (context.isAuthenticated()) {
                console.log(context.getUser())
                return context.getUser().profile;
            } else {
                const {user, info} = await context.authenticate("graphql-local", {email, password}, {session: true});
                context.login(user);
                return user.profile;
            }
        },
        logout: (root, {input}, context) => {
            if (context.isAuthenticated())
                context.logout();
            return true;
        },
        createProject: (root, {input}, context) => {
            if (context.isAuthenticated()) {
                let user = context.getUser();
                if (user.role === 'admin' || user.role === 'super_admin' || user.role === 'company' || user.role === 'company') {
                    let newOpp = new Project(input);
                    newOpp.user = user;
                    return newOpp.save()
                        .then(opp => opp)
                        .catch(e => {
                            console.log(e);
                            return e;
                        });
                } else {
                    return new Error("Unauthorized access");
                }
            } else {
                return new Error("Unauthorized access");
            }
        }
    }

};

module.exports = resolvers;
