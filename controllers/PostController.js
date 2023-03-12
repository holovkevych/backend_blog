import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec()
    
    res.json(posts)
  } catch (err) {
      console.log(err)
      res.status(500).json({
        message: 'Не вдалося отримати всі статті!'
      })
    }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id
    //const posts = await PostModel.find().populate('user').exec()
    PostModel.findOneAndUpdate({
      _id: postId,
    }, {
      $inc: { viewsCount: 1 },
    }, {
      returnDocument: 'after',
    },
    (err, doc) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          message: 'Не вдалося повернути статтю!'
        })
      } 
      
      if (!doc) {
        return res.status(404).json({
          message: 'Стаття не знайдена!'
        })
      }

      res.json(doc)
    },
  ).populate('user')

   //res.json(posts)
  } catch (err) {
      console.log(err)
      res.status(500).json({
        message: 'Не вдалося отримати статті!'
      })
    }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    })

    const post = await doc.save()

    res.json(post)
  } catch (err) {
      console.log(err)
      res.status(500).json({
        message: 'Не вдалося створити статтю!'
      })
  }
}