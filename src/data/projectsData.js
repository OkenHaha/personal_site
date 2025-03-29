export const projectsData = [
    {
        title: "Face2Comic",
        description: "A Pix2Pix cGAN-based approach to cartoonify human portraits using TensorFlow and CNN.",
        image: "/assets/images/face2comic.jpg", // Path from public folder
        tech: ["Python", "TensorFlow", "cGAN"],
        links: {
            github: "https://github.com/OkenHaha/face2comic-a-cGAN-approach-to-cartoonify-human-potraits",
            huggingface: "https://huggingface.co/okenk/face2comic",
        },
    },
    {
        title: "Image Captioning",
        description: "Generative model to create captions for images using Flickr8k dataset with CNN and Transformer architecture.",
        image: "/assets/images/image-caption.jpg",
        tech: ["Python", "CNN", "Transformers"],
        links: {
            github: "https://github.com/OkenHaha/mca_minor_project",
        },
    },
    {
        "title": "Facial Recognition System",
        "description": "Real-time facial recognition system using Haar Cascade and OpenCV for accurate identification.",
        "image": "/assets/images/facial-recognition.jpg",
        "tech": ["Python", "OpenCV", "Haar Cascade"],
        "links": {
            "github": "https://github.com/OkenHaha/CodSoft"
        }
    },
    {
        "title": "StackOverflow Clone",
        "description": "Full-stack StackOverflow clone with user authentication, question posting, commenting, and voting.",
        "image": "/assets/images/stackoverflow.jpg",
        "tech": ["MERN Stack", "Redux", "Twilio"],
        "links": {
            "github": "https://github.com/OkenHaha/Stack-Overflow-Clone",
            "website": "https://stack-overflow-clone-hazel.vercel.app/"
        }
    },
];