/*
 * @author Gaurav Kumar
 */

const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
    type User{
        _id:ID!
        username:String
        email:String
        enabled:Boolean
        verified:Boolean
        lastLoginAt:String
        role:String
        createdAt:String
        updatedAt:String
        profile:Profile
    }    
    
    type Address{
        street:String
        city:String
        state:String
        country:String
    }
    
    type Contact{
        email:String
        mobile:String
        address:Address
    }
    
    type Duration{
        start:String
        end:String
    }
    
    type Education{
        school:String
        degree:String
        field:String
        duration:Duration
        grade:Float
        summary:String
    }
    
    type Experience{
        title:String!
        org:String
        location:String
        responsibility:String
        duration:Duration
        summary:String
    }
        
    type Social{
        twitter:String
        linkedIn:String
        facebook:String
        github:String
    }
    
    type Skill{
        name:String
        level:String
    }
    
    type Project{
        _id:ID!
        title:String!
        body:String
        start:String
        end:String
        isPaid:Boolean
        type:String
        titleType:String
        user:User
        createdAt:String
        updatedAt:String
    }
    
    type Job{
        _id:ID!
        title:String!
        body:String
        start:String
        end:String
        apply:String
        url:String
        extra:String
        publish:Boolean
        user:User
        createdAt:String
        updatedAt:String
    }
    
    type Post{
        _id:ID!
        user:User
        body:String
        tags:[Tag]
        images:[String]
        score:Int
        createdAt:String
        updatedAt:String
    }
    
    type Tag{
        _id:ID!
        name:String!
        weight:String!
    }
   
    type TagRankResult{
        tag:Tag!
        rank:Int
   }
    
    type Profile{
        _id:ID!
        fullName:String!
        fName:String!
        lName:String
        profilePicUrl:String
        dob:String
        gender:String
        college:String
        university:String
        branch:String
        degree:String
        tags:[Tag]
        globalRank:Int
        tagsRank:[TagRankResult]
        contact:Contact
        website:String
        bio:String
        address:Address
        social:Social
    }
    
    type Error{
        code:Int
        message:String
    }
    
    input ProjectInput{
        title:String!
        body:String
        start:String
        end:String
        isPaid:Boolean
        type:String
        titleType:String
    }

    type PageInfo{
        cursor:String!
        nextCursor:String
        prevCursor:String
        startCursor:String
        endCursor:String
        hasNextPage:Boolean!
    }

    type Projects{
        totalPages:Int
        docs:[Project]
        totalDocs:Int
        page:Int
        hasPrevPage:Boolean!
        hasNextPage:Boolean!
        prevPage:Int
        nextPage:Int
    }
    
    type Users{
        totalPages:Int
        docs:[User]
        totalDocs:Int
        page:Int
        hasPrevPage:Boolean!
        hasNextPage:Boolean!
        prevPage:Int
        nextPage:Int
    }

    type Query{
        allUsers(page:Int, limit:Int):Users
        allProjects(page:Int, limit:Int):Projects
    }
    
    input UserInput{
        fName:String!
        lName:String
        email:String!
        password:String!
        gender:String
        dob:String
        role:String
    }
    
    input LoginInput{
        email:String!
        password:String!
    }
    
    input TagInput{
         _id:ID!
        name:String!
        weight:String!
    }
    
    input AddressInput{
        street:String
        city:String
        state:String
        country:String
    }
    
    input ContactInput{
        email:String
        mobile:String
        address:AddressInput
    }
    
    input ProfileInput{
        _id:ID!
        fullName:String
        fName:String
        lName: String
        profilePicUrl: String
        dob: String
        gender: String
        college: String
        university: String
        branch: String
        degree: String
        tags: [TagInput]
        contact: ContactInput
        website: String
        bio:String
        social:String
    }

    type Mutation{
        registerUser(input:UserInput):Profile
        updateUserProfile(id:String,input:ProfileInput):Profile
        sendEmailVerificationCode(input:String):Boolean
        verifyUserEmail(input:String):User 
        login(input:LoginInput):Profile
        logout(input:String):Boolean       
        createProject(input:ProjectInput!):Project
    }
`;

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

module.exports = schema;

// module.exports = typeDefs;
