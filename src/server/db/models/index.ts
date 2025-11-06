import type { Sequelize, ModelStatic, Model } from 'sequelize';

import { defineHistory } from './History.js';

export type DbModels = {
    History: ModelStatic<Model>;
};

export function initModels(sequelize: Sequelize): DbModels {
    const History = defineHistory(sequelize);

    return {
        History,
    };
}
