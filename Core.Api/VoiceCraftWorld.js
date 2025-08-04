import { VoiceCraftEntity } from "./VoiceCraftEntity";

export class VoiceCraftWorld {
  /** @type { MapIterator<VoiceCraftEntity> } */
  get entities() {
    return this.#_entities.values();
  }

  /** @type { Map<Number, VoiceCraftEntity> } */
  #_entities;

  constructor() {
    this.#_entities = new Map();
  }

  dispose() {
    this.clearEntities();

  }

  reset() {
    this.clearEntities();
  }

  createEntity()
  {
    const id = this.getLowestAvailableId();
    const entity = new VoiceCraftEntity(id, this);
    if(this.#_entities.has(id))
        throw new Error("Failed to create entity!");
    this.#_entities.set(id, entity);

    //Setup Entity.
    return entity;
  }

  /** @param { VoiceCraftEntity } entity */
  addEntity(entity)
  {
    if(this.#_entities.has(entity.id))
        throw new Error("Failed to add entity! An entity with the same id already exists!");
    if (entity.world != this)
        throw new Error("Failed to add entity! The entity is not associated with this world!");

    this.#_entities.set(entity.id, entity);
    //Setup Entity.
  }

  getEntity(id)
  {
    return this.#_entities.get(id);
  }

  destroyEntity(id)
  {
    if (!this.#_entities.has(id))
        throw new Error("Failed to destroy entity! Entity not found!");

    this.#_entities.delete(id);

    //Destroy Entity.
  }

  clearEntities()
  {
    const entities = Array.from(this.#_entities);
    this.#_entities.clear();
    entities.forEach(entity => {
        //Destroy Entity
    });
  }

  /** @param { VoiceCraftEntity } entity */
  #removeEntity(entity)
  {
      //Remove Event Subscription
      if(!this.#_entities.has(entity.id)) return;
      this.#_entities.delete(entity.id);
      //Invoke
  }
  
  getLowestAvailableId()
  {
    for(let i = 0; i < 2147483647; i++)
    {
        if(!this.#_entities.has(i))
            return i;
    }

    throw new Error("Could not find an available id!");
  }
}
