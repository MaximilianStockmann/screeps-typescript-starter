import { CreepRoleManager, ROLE } from "./creepManager";

export class UpgraderCreepManager implements CreepRoleManager {
    private upgraderCreepAmount: number;

    constructor() {
        this.upgraderCreepAmount = this.countUpgraderCreeps();
    }

    executeBasicRoutine(): void {
        this.AllUpgraderCreepNames.forEach((creepName) => {
            const creep = Game.creeps[creepName] as UpgraderCreep;

            this.upgrade(creep);
        })
    }

    upgrade(creep: UpgraderCreep): void {
        const roomController = Game.getObjectById(creep.memory.assignedRCId) as StructureController;
        const assignedSpawn = Game.getObjectById(creep.memory.assignedSpawnId) as StructureSpawn;
        const creepStore = creep.store;

        if (creep.upgradeController(roomController) === ERR_NOT_IN_RANGE && creepStore.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            creep.moveTo(roomController);
        // This doesn't work
        } else if (creepStore.getUsedCapacity(RESOURCE_ENERGY) === 0 && assignedSpawn.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            if (creep.withdraw(assignedSpawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(assignedSpawn);
            } else {

            }
        }
    }

    public spawnUpgrader(spawn: StructureSpawn, assignedRC: StructureController) {
        spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], 'Upgrader' + Game.time, { memory: new UpgraderCreepMemory(spawn.room.name, assignedRC, spawn) })
    }

    public get AllUpgraderCreepNames() {
        return Object.keys(Game.creeps).filter((creepName) => creepName.toLowerCase().includes("upgrader"));
    }

    private countUpgraderCreeps() {
        return this.AllUpgraderCreepNames.length;
    }
}

class UpgraderCreepMemory implements CreepMemory {
    role: string;
    room: string;
    working: boolean;
    assignedRCId: Id<StructureController>;
    assignedSpawnId: Id<StructureSpawn>;

    constructor(room: string, assignedController: StructureController, assignedSpawn: StructureSpawn) {
        this.role = ROLE.UPGRADER;
        this.room = room;
        this.working = true;
        this.assignedRCId = assignedController.id;
        this.assignedSpawnId = assignedSpawn.id;
    }
}

interface UpgraderCreep extends Creep {
    memory: UpgraderCreepMemory;
}
