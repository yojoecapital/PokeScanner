# PokéScanner
## Problem Statement
Pokémon enthusiasts can use this web or mobile application and take a photo of any generation 1 Pokémon and be provided with its name, type, and attributes (its Pokédex information) so that they may easily be able to know which Pokémon to use in battles and learn more about the Pokémon in general.
***
## Customer
### Description
Any aspiring Pokémon enthusiast, Pokémon game player, or watcher of the Pokémon anime, especially those who don't have much prior Pokémon experience.

### Other customer(s) or stakeholder(s)
- Diehard Pokémon fans who want to check their knowledge or work on memorizing new Pokémon stats
- New Pokémon fans who do not yet know every Pokémon but want to learn more
- Companies like Nintendo and Gamefreak because it facilitates use of their games/products
- Competitive Pokémon players who need quick and easy access to information about each of their Pokémon
***
## Application Type
Mobile application that can be used on smartphones and tablets equipped with a camera.
 
### Tech stack

#### Client Tech (Frontend)
- Smartphone (Android or iOS)
- Computer (Windows or Mac)
- Camera
- [Kivy](https://kivy.org/) which creates apps using [Python](https://www.python.org/)

#### Server Tech (Backend)
- PC (desktop or laptop) for development
- [TensorFlow](https://www.tensorflow.org/) in [Python](https://www.python.org/) for Yolov4 object detection
- Test Databases:
  - https://www.kaggle.com/datasets/mornville/pokemonimagedataset
- Training Databases:
  - https://www.kaggle.com/datasets/lantian773030/pokemonclassification/code
  - https://www.kaggle.com/datasets/thedagger/pokemon-generation-one
  - *Useful for improving*: https://www.kaggle.com/datasets/unexpectedscepticism/11945-pokemon-from-first-gen?select=PokemonData
  
***
## Top Application Capabilities 
1. Take a photo within the application
2. Identify each Pokémon in the photo
3. Allow user to select an identified Pokémon
4. Describe the selected Pokémon to the user
5. In-Battle move recommender (Secondary)
6. [Become a Pokémon Master](https://youtu.be/JuYeHPFR3f0) (Secondary)
***
## Scenarios

### Scenario #1
Bob is playing Pokémon and encounters one that he does not know the stats for in battle. He doesn't know which of his Pokémon would pair up well against this Pokémon. He downloads the PokeScanner App and takes a picture of the unknown Pokémon he encountered. The app then shows him all the relevant stats and information about this Pokémon. He then looks at which Pokémon he has available and decides which one to use in battle.

### Scenario #2
Bob was watching a Pokémon anime for the first time and was fascinated by their abilities. He was unfamiliar with some of those Pokémon and wanted to learn more about them. Bob used the PokeScanner application to take pictures of the Pokémon in the show and found out who they are as well as some fun facts about each one. Bob is happy.
***
## Team Members

| Name               | Location	| Time zone offset | Email                     |
| ---                | ---      | ---              | ---                       |
| Yousef Suleiman    | Chicago  | 0                | ysuleiman@hawk.iit.edu    |
| Francisco Chavez   | Chicago  | 0                | fchavez2@hawk.iit.edu     |
| Michal Landa       | Chicago  | 0                | mlanda1@hawk.iit.edu      |
| Michal Malek       | Chicago  | 0                | mmalek3@hawk.iit.edu      | 
| Ibrahim Marou      | Chicago  | 0                | imarou@hawk.iit.edu       |
| Shagun Karmacharya | Chicago  | 0                | skarmacharya@hawk.iit.edu |
***

## Team Working Agreement
### What do we want to accomplish/learn together?
- Web development
- Backend development
- ReactJS
- API Calls
- Image Classification
- Be the very best
- Like no one ever was

### What tools do we want to use?
- React
- Github
- Kivy
- Django
- Tensorflow
- Pytorch

### What is the teams requested approach/behavior?
- Spread work evenly
- Communicate outside of class via Discord group chat
- Be willing to meet outside of class if required to resolve issues
- Consider whole group's opinion

### What do we define as unacceptable behavior?
- Disrespectful communication
- Ignoring members
- Abandoning tasks

### How will we productively solve disagreement?
- Have whole group discuss issue
- Use fist of 5
- Vote on resolution

***
## Sprint Schedule
| Week                                                | Sprint Leader      |
| ---                                                 | ---                |
| 4 - Problem Framing                                 | Francisco Chavez   |
| 5 - Think, build, test, and demo for midterm        | Francisco Chavez   |
| 6 - Think, build, test, and demo for midterm        | Yousef Suleiman    |
| 7 - Think, build, test, and demo for midterm        | Yousef Suleiman    |
| 8 - Think, build, test, and demo for midterm        | Ibrahim Marou      |
| 9 - Think, build, test, and demo for final          | Ibrahim Marou      |
| 10 - Think, build, test, and demo for final         | Michal Malek       |
| 11 - Think, build, test, and demo for final	        | Michal Malek       |
| 12 - Think, build, test, and demo for final         | Michal Landa       |
| 13 - Think, build, test, and demo for final         | Michal Landa       |
| 14 - Presentation dry run                           | Shagun Karmacharya |
| 15 - Presentation                                   | Shagun Karmacharya |
