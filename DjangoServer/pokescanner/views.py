from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .helpers import *

def get_pokemon_metadata(pokemonId):
    data = {}
    try:
        data['img'] = f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/{pokemonId}.gif'
        data["description"] = get_description(pokemonId)
        data["types"] = types =get_types(pokemonId)
        data["strength"] = get_strengths(types)
        data["weakness"] = get_weaknesses(types)
        data["abilities"] = get_abilities(pokemonId)
        data["colors"] = get_types_colors(data["types"] + data["strength"] + data["weakness"])
        stats = get_stats(pokemonId)
        data["hp"] = str(stats[0])
        data["attack"] = str(stats[1])
        data["defense"] = str(stats[2])
        data["sp.attack"] = str(stats[3])
        data["sp.defense"] = str(stats[4])
        data["speed"] = str(stats[5])
        data["moveset"] = get_moveset(pokemonId)
        data["evolutions"] = [{'name': get_name(x), 'id': x, 'img': f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/{x}.png'} for x in get_chain(pokemonId)]
        return data
    except:
        return None
    
#GET /get_pokemon_meta/?pokemonId=10
@csrf_exempt 
def get_pokemon_meta(request):
    data = {}
    try:
        pokemonId = int(request.GET.get('pokemonId'))
        data = {
            'id': str(pokemonId),
            'name': get_name(pokemonId),
            'meta': get_pokemon_metadata(pokemonId)
        }
        return JsonResponse(data)
    except:
        return JsonResponse({'error': 'Bad Request'}, status=400)

def get_pokemon_ID(pokemon):
    data = {}
    try:
        pokemonId = get_mapped_id(pokemon)
        data = {
            'id': str(pokemonId),
            'name': pokemon,
            'meta': get_pokemon_metadata(pokemonId)
        }
        return pokemonId
    except:
        return JsonResponse({'error': 'Bad Request'}, status=400)

def get_pokemon_image_type(pokemon):
    data = {}
    try:
        pokemonId = get_mapped_id(pokemon)
        type = get_types(pokemonId)
        data = {
            'id': str(pokemonId),
            'name': pokemon,
            'meta': get_pokemon_metadata(pokemonId)
        }
        return type # based on type, corresponding image can be picked 
    except:
        return JsonResponse({'error': 'Bad Request'}, status=400)
    
@csrf_exempt 
def classify_image(request):
    print("TEST" + str(request.FILES) + "TEST")
    if request.method == 'POST' and request.FILES['image']:
        # Save the uploaded file to the server
        image = request.FILES['image']
        fs = FileSystemStorage()
        filename = fs.save('pokescanner/tmp/' + image.name, image)

        # Classify the uploaded image
        index, pokemon = make_prediction(filename)

        # Return the classification result
        pokemonId = get_mapped_id(pokemon)
        data = {
            'id': str(pokemonId),
            'name': pokemon,
            'meta': get_pokemon_metadata(pokemonId)
        }
        return JsonResponse(data)

    # Return a 400 Bad Request error if the request method is not POST or if no image was uploaded
    return JsonResponse({'error': 'Bad Request'}, status=400)
