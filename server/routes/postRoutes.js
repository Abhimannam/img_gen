import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.route('/').get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});

router.route('/').post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    // Validate that the photo parameter is present
    if (!photo) {
      return res.status(400).json({ success: false, message: 'Missing photo parameter' });
    }
    console.log(req.body)

    // Upload the photo to Cloudinary
    const photoUrl = await cloudinary.uploader.upload(photo);
    console.log(req.body)
    // Create a new post with the photo URL
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
      // photo
    });

    // Send success response with the created post data
    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});





export default router;