import { CreepRoleManager, ROLE } from "./creepManager";

export class BuilderCreepManager implements CreepRoleManager {
    private builderCreepAmount: number;

    constructor() {
        this.builderCreepAmount = this.countBuilderCreeps();
    }

    executeBasicRoutine(): void {
        this.AllBuilderCreepNames.forEach((creepName) => {
            const creep = Game.creeps[creepName] as BuilderCreep;

            this.build(creep);
        })
    }

    build(creep: BuilderCreep): void {
        const constructionSite = creep.room.find(FIND_CONSTRUCTION_SITES)[0];
        const assignedSpawn = Game.getObjectById(creep.memory.assignedSpawnId) as StructureSpawn;

        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            creep.moveTo(constructionSite);
        } else if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0 && assignedSpawn.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            if (creep.withdraw(assignedSpawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(assignedSpawn);
            } else {

            }
        }
    }

    public spawnBuilder(spawn: StructureSpawn) {
        spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], 'Builder' + Game.time, { memory: new BuilderCreepMemory(spawn.room.name, spawn) })
    }

    public get AllBuilderCreepNames() {
        return Object.keys(Game.creeps).filter((creepName) => creepName.toLowerCase().includes("builder"));
    }

    private countBuilderCreeps() {
        return this.AllBuilderCreepNames.length;
    }
}

class BuilderCreepMemory implements CreepMemory {
    role: string;
    room: string;
    working: boolean;
    assignedSpawnId: Id<StructureSpawn>;

    constructor(room: string, assignedSpawn: StructureSpawn) {
        this.role = ROLE.BUILDER;
        this.room = room;
        this.working = true;
        this.assignedSpawnId = assignedSpawn.id;
    }
}

interface BuilderCreep extends Creep {
    memory: BuilderCreepMemory;
}
