import { DataTypes, Sequelize } from 'sequelize';
import { PM2AppStatuses } from '../../../types/pm2.js';

export function defineHistory(sequelize: Sequelize) {
    return sequelize.define(
        'History',
        {
            ts: {
                type: DataTypes.DATE,
                allowNull: false,
                primaryKey: true,
            },
            pm_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                values: PM2AppStatuses,
            },
            cpu: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            memory: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            uptime: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'History',
        }
    );
}
