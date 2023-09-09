class CreepManager {
    private static _instance: CreepManager;
    private _harvesterCreepSpawner;

    private constructor() {
        this._harvesterCreepSpawner = new HarvesterCreepSpawner()
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public spawnHarvester(spawn: StructureSpawn) {
        this._harvesterCreepSpawner.spawnHarvester(spawn);
    }
}

class HarvesterCreepSpawner {
    private harvesterCreepAmount: number;

    constructor() {
        this.harvesterCreepAmount = this.countHarvesterCreeps();
    }

    countHarvesterCreeps() {
        return Object.keys(Game.creeps).filter((creepName) => creepName.toLowerCase().includes("harvester")).length;
    }

    spawnHarvester(spawn: StructureSpawn) {
        spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester' + this.harvesterCreepAmount, { memory: new HarvesterCreepMemory(spawn.room.name) })
    }
}

class HarvesterCreepMemory implements CreepMemory {
    role: string;
    room: string;
    working: boolean;

    constructor(room: string) {
        this.role = ROLE.HARVESTER;
        this.room = room;
        this.working = true;
    }
}

enum ROLE {
    HARVESTER = 'harvester'
}

export const creepManager = CreepManager.Instance;
