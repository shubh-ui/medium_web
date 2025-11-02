import Notification from "../Schema/Notification.js";
import User from "../Schema/User.js";

export const searchUsers = (req, res) => {
    let { query } = req.body;
    User.find({ "personal_info.username": new RegExp(query, "i") })
      .limit(50)
      .select({ personal_info: { username: 1, fullname: 1, profile_img: 1 } })
      .then(users => {
        return res.status(200).json(users);
      })
      .catch(err => {
        return res.status(500).json({ error: err.message });
      });
  }

export const getProfile = (req, res) => {
      let { username } = req.body;
      // console.log(req.body)
  
      User.findOne({ "personal_info.username": username })
          .select("-personal_info.password -google_auth -blogs")
          .then(user => {
              return res.status(200).json( user )
          })
          .catch(err => {
              return res.status(500).json({ Error: err.message })
          })
  }

export const isLikedByUser =  (req, res) => {
    let user_id = req.user;

    let { _id } = req.body;

    Notification.exists({ user: user_id , type: "like", blog: _id})
    .then((result) => {
        return res.status(200).json(result);
    })
    .catch(err => {
        return res.status(500).json({Error: err.message});
    })
}