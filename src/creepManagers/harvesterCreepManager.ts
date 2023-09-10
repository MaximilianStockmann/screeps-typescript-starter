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
        const assignedResource = Game.getObjectById(creep.memory.assignedResource.id) as Source;
        const assignedSpawn = Game.getObjectById(creep.memory.assignedSpawn.id) as StructureSpawn;

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
        spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], 'Harvester' + this.harvesterCreepAmount, { memory: new HarvesterCreepMemory(spawn.room.name, assignedResource, spawn) })
    }
}

interface HarvesterCreep extends Creep {
    memory: HarvesterCreepMemory;
}

class HarvesterCreepMemory implements CreepMemory {
    role: string;
    room: string;
    working: boolean;
    assignedResource: Source | Mineral | Deposit;
    assignedSpawn: StructureSpawn;

    constructor(room: string, assignedResource: Source | Mineral | Deposit, assignedSpawn: StructureSpawn) {
        this.role = ROLE.HARVESTER;
        this.room = room;
        this.working = true;
        this.assignedResource = assignedResource;
        this.assignedSpawn = assignedSpawn;
    }
}
