# Django Server Quick Start

1. Install [Django](https://docs.djangoproject.com/en/4.1/topics/install/)
2. Install TensorFlow `pip install tensorflow==2.10.0` and Pillow if not already installed `pip install Pillow`
3. `cd` into the `DjangoServer` directory
4. Use `python manage.py runserver` to start the Django Server

* Depending on the local host URL you may need to change the URL in `DjangoServer/Project/settings.py` under the `CSRF_TRUSTED_ORIGINS` and `CORS_ORIGIN_WHITELIST` lists
* You may need to add a `tmp` directory in `DjangoServer/pokescanner/` if there is not one already there. The files uploaded in `classify_image` API get saved there.
* You also need the `model.h5` saved in `DjangoServer/pokescanner/CNN`. You can get that from [here](https://drive.google.com/file/d/16PbzNQ66HXX-KqLoJZo9kbf2FNNU4EgC/view?usp=sharing).
