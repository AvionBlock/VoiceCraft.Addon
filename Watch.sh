# Regolith
cd ./Basic && mkdir -p ./packs/data && regolith watch &
cd ../Core.McHttp && mkdir -p ./packs/data && regolith watch &
cd ../Core.McWss && mkdir -p ./packs/data && regolith watch &

# Typescript
cd ../Basic && tsc -watch --preserveWatchOutput &
cd ../Core.McHttp && tsc -watch --preserveWatchOutput &
cd ../Core.McWss && tsc -watch --preserveWatchOutput
wait