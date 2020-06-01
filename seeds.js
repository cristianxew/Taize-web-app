const mongoose = require("mongoose");
const testimony = require("./models/testimony");
const comment = require("./models/comment");

const seeds = [
  {
    name: "Nombre",
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
    description:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
  },
  {
    name: "Nombre",
    image:
      "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
    description:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
  },
  {
    name: "Nombre",
    image:
      "https://images.unsplash.com/photo-1517217451453-818405428795?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjI5MzI0fQ&auto=format&fit=crop&w=1050&q=80",
    description:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
  },
];

async function seedDB() {
  try {
    await testimony.deleteMany({});
    console.log("testimonies removed");
    await comment.deleteMany({});
    console.log("comments removed");

    /* for (const seed of seeds) {
            let camps = await testimony.create(seed);
            console.log('testimonies created');
            let comentario = await comment.create(
                {
                    text: 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.',
                    author: 'Homero'
                },
            )
            console.log('comments created');
            camps.comments.push(comentario);
            camps.save();
            console.log('comments added to testimony');
        } */
  } catch (err) {
    console.log(err);
  }
}

module.exports = seedDB;
