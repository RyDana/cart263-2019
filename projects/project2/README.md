STORYTIME
Dana Ryashy

This game is meant to imitate online exercises for children that help them learn reading faster.
The James Bridle article mentioned the hypothesis that the videos dedicated to children on YouTube could be generated practically automatically, since they seem to be random characters and storylines amalgamated together. Because of this, I knew from the beginning that I wanted to play with some visuals that are generated in an automatic manner. From those visuals, I would've wanted to create some sort of cartoon. Since I wanted the visuals to look cartoonish, I looked for services providing clipart or vector images. I found the website OpenClipart that provided an API capable of finding clipart images from a specific query and returning them (or their source) in a JSON format. I imagined how, using this API, the player could choose whatever character they would like, and a cartoon would be generated with it. Since the JSON also informed how many likes each image received, I tried sorting the images provided by OpenClipart and selecting the one with the most likes to be the one used as the main character of the cartoon. However, the results were not always satisfying.

By trying OpenClipart I could notice how it would sometimes give images that are not necessarily kid-friendly. This worked well with the message of Bridle's article. Noticing that the images had tags, I decided to retrieve one random tag from a random image and use it as a new query to search for more clipart images and display them. In this manner, searching for 'penguin' would sometimes sequentially lead to images of knives. I thought it resembles the Autoplay found on YouTube and how, through the suggested videos, one can land on videos that had nothing to do with the initial query.

I wanted to perform the same thing with text. I knew Wikipedia could also possibly have an API to play with. Luckily, I discovered a tutorial on how to not only use the API, but also on how to generate new search queries for previously found article pages. I had the idea of combining text and images for the visuals to create a karaoke-type game, but with sequentially randomized lyrics. At some point, the initial Wikipedia query 'rainbow' lead me to a page on Jihadism. I would've wanted to find a way to take the different sentences coming from the different Wikipedia articles and turn them into a song. That would've necessitated analyzing the syllables in each word and breaking the text into verses with similar amounts of syllables. The final word of every second verse should be replaced with one that rhymes with the final word of the previous verse. I knew Datamuse has the ability of both analyzing the amount of syllables of a word and rhyme it with another, but doing so sounded too extensive for the purposes of this project.

Therefore, I decided that, instead of signing the text, it would be simply read. The game, instead of being karaoke-like, could be a reading game that makes the player practice their reading skills. The player would need to read along to experience cartoon-like visuals. This is a reference to the educational videos for children that are found on YouTube. However, instead of learning how to read the alphabet or count numbers, the player learns things like the release year of Britney Spears' first album or the edible parts of a dog.