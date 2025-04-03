import { Sequelize } from "sequelize";
import { sequelize } from "../config/db.js";

export const Event = sequelize.define("events", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [1, 50],
                msg: "Размер поля мал или велик"
            }
        }
    },
    description: {
        type: Sequelize.STRING,
        validate: {
            len: {
                args: [0, 300],
                msg: "Размер поля велик"
            }
        }
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}); 