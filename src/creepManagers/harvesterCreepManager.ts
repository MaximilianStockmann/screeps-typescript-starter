import { ROLE, carryToSpawn, checkIfFull } from "./creepManager";

/**
 * @description Manages spawning and commanding harvester creeps
 */
export class HarvesterCreepManager {
    private harvesterCreepAmount: number;

    constructor() {
        this.harvesterCreepAmount = this.countHarvesterCreeps();
    }

    public executeBasicRoutine() {
        this.AllHarvesterCreepNames.forEach((creepName) => {
            const creep = Game.creeps[creepName] as HarvesterCreep;

            this.harvest(creep);
        })
    }

    public get AllHarvesterCreepNames() {
        return Object.keys(Game.creeps).filter((creepName) => creepName.toLowerCase().includes("harvester"));
    }

    /**
     *
     * @param creep
     * @description Default assigned spawn is the spawn the creep was created from
     */
    private harvest(creep: HarvesterCreep) {
        let isFull = checkIfFull(creep);
        const assignedResource = Game.getObjectById(creep.memory.assignedResourceId) as Source;
        const assignedSpawn = Game.getObjectById(creep.memory.assignedSpawnId) as StructureSpawn;

        if (!isFull && creep.harvest(assignedResource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(assignedResource);
        } else if (isFull) {
            carryToSpawn(creep, assignedSpawn);
        }
    }

    private countHarvesterCreeps() {
        return this.AllHarvesterCreepNames.length;
    }

    public spawnHarvester(spawn: StructureSpawn, assignedResource: Source | Mineral | Deposit) {
        spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], 'Harvester' + Game.time, { memory: new HarvesterCreepMemory(spawn.room, assignedResource, spawn) });
    }
}

interface HarvesterCreep extends Creep {
    memory: HarvesterCreepMemory;
}

class HarvesterCreepMemory implements CreepMemory {
    role: string;
    roomName: string;
    working: boolean;
    assignedResourceId: Id<Source | Mineral | Deposit>;
    assignedSpawnId: Id<StructureSpawn>;

    constructor(room: Room, assignedResource: Source | Mineral | Deposit, assignedSpawn: StructureSpawn) {
        this.role = ROLE.HARVESTER;
        this.roomName = room.name;
        this.working = true;
        this.assignedResourceId = assignedResource.id;
        this.assignedSpawnId = assignedSpawn.id;
    }
}
