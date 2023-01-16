
const articleModel = require("../models/articleModel");

async function createArticleInMongoDb(articleDetails) {
    try {
        const dataArticleCreatedinDb = await new articleModel(articleDetails).save();
        return dataArticleCreatedinDb;
    } catch {
        return console.log('can not create article');
    }
}
async function getAllArticles() {
    try {
        const allArticles = await articleModel.find();
        return allArticles;
    } catch {
        return null;
    }
}

async function deleteArticle(id) {
    try {

        const delArticle = await articleModel.deleteOne({
            _id: id
        });
        return delArticle;
    } catch {
        return null;
    }
}

async function updateArticle(id, articleData) {
    try {
        console.log(id, articleData);
        const updatedArticle = await articleModel.findByIdAndUpdate({ _id: id }, articleData);
        console.log(updatedArticle);
        return updatedArticle;
    }
    catch
    {
        return null;
    }
}

async function getOneByUserIDAndarticleID(userId, articleId) {
    try {
        const oneArticle = await articleModel.findOne({
            userId: userId,
            _id: articleId
        });
        return oneArticle;
    }
    catch {
        return null
    }
}

async function getArticlesByUserId(userId) {

    try {
        const userArticles = await articleModel.find({ userId: userId });
        return userArticles;
    } catch {
        return console.log('No Articles found for thit user');
    }
}

// async function getOneArticle(id, articleData) {
//     try {
//         const article = await articleModel.findOne({ _id: id }, articleData);
//         return article;
//     }
//     catch {
//         return null;
//     }
// }


module.exports = {
    createArticleInMongoDb,
    getAllArticles,
    deleteArticle,
    updateArticle,
    getOneByUserIDAndarticleID,
    getArticlesByUserId,
    // getOneArticle
}

