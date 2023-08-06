# R.A.C.K. Neural Audio Inverter

[🖼️ Demo presentation](demo-presentation.pdf)

## Installation (linux)

```
curl https://pyenv.run | bash

# Put these 3 lines in your .bashrc
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv virtualenv-init -)"

# Required for pyenv installation
sudo apt-get install -y zlib1g-dev libssl-dev lzma-dev libsqlite3-dev libreadline6-dev libffi-dev libncurses-dev bzip2-dev
pyenv install 3.10.8

pyenv virtualenv 3.10.8 rka-808
pyenv activate rka-808
pip install requirements.txt

# For audio manipulation
sudo apt-get install ffmpeg
```

## Run dev server

```
cd api/
flask --app main run --host=0.0.0.0 --port=8080
```

