import json
from keras.models import load_model
from keras.preprocessing import image
from tensorflow.keras.utils import load_img
from tensorflow.keras.preprocessing.image import img_to_array
import numpy as np

#region Helpers for classify_image
image_size = (256, 256, 3)
num_classes = 151

modelpath = 'pokescanner/CNN/model.h5'
model = load_model(modelpath)

def get_classes():
    classes = []
    with open('pokescanner/CNN/classes.txt') as file:
        for line in file:
            if line[-1] == '\n':
                line = line[:-1]
            classes.append(line)
    return classes

classes = get_classes()

def make_prediction(imagepath):
    print(imagepath)
    img = load_img(imagepath, target_size=image_size[:2])
    x = img_to_array(img)
    x = np.expand_dims(x, axis=0)

    images = np.vstack([x])
    prediction = model.predict(images, batch_size=10)
    i = prediction.argmax()
    return (i, classes[i])
#endregion

#region Helpers for get_pokemon_meta
def get_mapped_id(name):
    with open ('pokescanner/json/classes-map.json', "r") as f:
        data = json.loads(f.read())
        return data[name]

def get_types(pokemonId):
    with open ('pokescanner/json/evolution-chain.json', "r") as f:
        data = json.loads(f.read())
        return [t.capitalize() for t in data[pokemonId - 1]["types"]]

def get_weaknesses(types):
    damage = {}
    with open ('pokescanner/json/types.json', "r") as f:
        data = json.loads(f.read())
        for t in types:
            entry = next(e for e in data if e["name"] == t)
            for v in entry["vulnerablities"]:
                if v in damage:
                    damage[v] = damage[v] * 2
                else:
                    damage[v] = 2
            for r in entry["resistant"]:
                if r in damage:
                    damage[r] = damage[r] * 0.5
                else:
                    damage[r] = 0
            for n in entry["noeffect"]:
                if n in damage:
                    damage[n] = damage[n] * 0
                else:
                    damage[n] = 0
    return [x[0] for x in damage.items() if x[1] >= 2]

def get_strengths(types):
    damage = {}
    with open ('pokescanner/json/types.json', "r") as f:
        data = json.loads(f.read())
        for t in types:
            entry = next(e for e in data if e["name"] == t)
            for s in entry["strengths"]:
                if s in damage:
                    damage[s] = damage[s] * 2
                else:
                    damage[s] = 2
            for w in entry["weaknesses"]:
                if w in damage:
                    damage[w] = damage[w] * 0.5
                else:
                    damage[w] = 0
            for i in entry["immunes"]:
                if i in damage:
                    damage[i] = damage[i] * 0
                else:
                    damage[i] = 0
    return [x[0] for x in damage.items() if x[1] >= 2]

def get_chain(pokemonId):
    froms = []
    tos = []
    with open ('pokescanner/json/evolution-chain.json', "r") as f:
        data = json.loads(f.read())
        pokemon = data[pokemonId - 1]
        prev = pokemon["from"]
        while prev != None:
            froms = [prev] + froms
            prev = data[prev - 1]["from"]
        next = pokemon["to"]
        while next != None:
            tos = tos + [next]
            next = data[next - 1]["to"]
    return froms + [pokemonId] + tos

def get_name(pokemonId):
    with open ('pokescanner/json/evolution-chain.json', "r") as f:
        data = json.loads(f.read())
        return data[pokemonId - 1]["name"]

def get_types_colors(list):
    colors = {}
    with open ('pokescanner/json/types.json', "r") as f:
        data = json.loads(f.read())
        for t in list:
            colors[t] = next(c["color"] for c in data if c["name"] == t)
        return colors


def get_moveset(pokemonId):
    with open ('pokescanner/json/preferred-moves.json', "r") as preferredFile:
        preferredJson = json.loads(preferredFile.read())
        movesetList = next(l for l in preferredJson if l["id"] == pokemonId)["moveset"]
        if len(movesetList) == 0:
            movesetList = [0, 1, 2, 3]
        with open ('pokescanner/json/' + str(pokemonId) + '.json', "r") as pokemonFile:
            pokemonJson = json.loads(pokemonFile.read())
            movesetNames = []
            for moveIndex in movesetList:
                movesetNames.append(pokemonJson["moves"][int(moveIndex)]["move"]["name"])
            return movesetNames

def get_abilities(pokemonId):
    with open ('pokescanner/json/' + str(pokemonId) + '.json', "r") as pokemonFile:
        pokemonJson = json.loads(pokemonFile.read())
        return [a["ability"]["name"].capitalize() for a in pokemonJson["abilities"]]

#[hp, attack, defense, sp. attack, sp. defense, speed]
def get_stats(pokemonId):
    with open ('pokescanner/json/' + str(pokemonId) + '.json', "r") as pokemonFile:
        pokemonJson = json.loads(pokemonFile.read())
        return [a["base_stat"] for a in pokemonJson["stats"]]

def get_description(pokemonId):
    with open ('pokescanner/json/descriptions.json', "r") as f:
        data = json.loads(f.read())
        return next(d for d in data if d["id"] == pokemonId)["description"]

def get_color_list(value):
    if value > 15 / 18:
        return [0, .65, .62, 1]
    if value > 12 / 18:
        return [.14, .8, .37, 1]
    if value > 9 / 18:
        return [.63, .9, .08, 1]
    if value > 6 / 18:
        return [1, .87, .34, 1]
    if value > 3 / 18:
        return [1, .5, .06, 1]
    return [.95, .27, .27, 1]
#endregion