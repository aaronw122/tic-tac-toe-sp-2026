set -euo pipefail #enables strict mode

CONTEXT="home" #sets variable i already have saved for my home server

echo "Building and starting stack on remote server"
docker --context "$CONTEXT" compose up -d --build --remove-orphans
#runs docker compose against home context.
# d runs in detached mode
# build rebuilds images before startin
# remove orphans gets rid of containers not defined in compose file

echo "done. remote containers: "
docker --context "$CONTEXT" compose ps
