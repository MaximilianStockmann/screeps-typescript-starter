import { BuilderCreepManager } from "./builderCreepManager";
import { HarvesterCreepManager } from "./harvesterCreepManager";
import { UpgraderCreepManager } from "./upgraderCreepManager";

class CreepManager {
    private static _instance: CreepManager;
    private _harvesterCreepManager: HarvesterCreepManager;
    private _upgraderCreepManager: UpgraderCreepManager;
    private _builderCreepManager: BuilderCreepManager;

    private constructor() {
        this._harvesterCreepManager = new HarvesterCreepManager();
        this._upgraderCreepManager = new UpgraderCreepManager();
        this._builderCreepManager = new BuilderCreepManager();
    }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public spawnHarvester(spawn: StructureSpawn) {
        this._harvesterCreepManager.spawnHarvester(spawn, spawn.room.find(FIND_SOURCES_ACTIVE)[0]);
    }

    public spawnUpgrader(spawn: StructureSpawn) {
        this._upgraderCreepManager.spawnUpgrader(spawn, spawn.room.controller as StructureController)
    }

    public spawnBuilder(spawn: StructureSpawn) {
        this._builderCreepManager.spawnBuilder(spawn);
    }

    public get AllHarvesterCreepNames() {
        return this._harvesterCreepManager.AllHarvesterCreepNames;
    }

    public get AllBuilderCreepNames() {
        return this._builderCreepManager.AllBuilderCreepNames;
    }

    public get AllUpgraderCreepNames() {
        return this._upgraderCreepManager.AllUpgraderCreepNames;
    }

    public run() {
        this._harvesterCreepManager.executeBasicRoutine();
        this._upgraderCreepManager.executeBasicRoutine();
        this._builderCreepManager.executeBasicRoutine();
    }
}

export enum ROLE {
    HARVESTER = 'harvester',
    BUILDER = 'builder',
    UPGRADER = 'upgrader'
}

/*************************************/
/*********GENERAL CREEP UTIL**********/
/*************************************/

export function checkIfFull(creep: Creep) {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
        return true;
    } else {
        return false;
    }
}

export function carryToSpawn(creep: Creep, spawn: StructureSpawn) {
    if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn);
    } else {

    }
}

export function findClosestSource(spawn: StructureSpawn) {
    const sources = spawn.room.find(FIND_SOURCES);

    return PathFinder.search(spawn.pos, sources.map((source) => source.pos))
}

export interface CreepRoleManager {
    executeBasicRoutine(): void
}

export const creepManager = CreepManager.Instance;
