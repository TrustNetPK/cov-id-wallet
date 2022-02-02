/*
    Function related to credential groups feature
*/

import moment from "moment";
import { getItem, saveItem } from "./Storage";

const GROUP_ASYNC_ENUM = {
    CREDENTIAL_GROUPS: 'credential_groups',
}

/**
 * Function to fetch all credential groups
 */
export const fetch_all_groups = async () => {
    try {
        let groups = await getItem(GROUP_ASYNC_ENUM.CREDENTIAL_GROUPS);
        if (groups == null || groups == undefined || groups == '')
            groups = [];
        else {
            groups = JSON.parse(groups);
        }
        return groups;
    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @param {String} groupName 
 * @param {Array} credentials 
 */
export const add_credential_group = async (groupName, credentials) => {
    try {
        let groups = await fetch_all_groups();
        let group = {
            id: Date.now().toString(),
            createdAt: moment(),
            updatedAt: moment(),
            group_name: groupName,
            credentials: credentials,
        };
        groups.push(group);
        await saveItem(GROUP_ASYNC_ENUM.CREDENTIAL_GROUPS, JSON.stringify(groups))
    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @param {String} groupName 
 * @param {Array} credentials 
 */
export const edit_credential_group = async (groupName, group, credentials) => {
    try {
        let groups = await fetch_all_groups();
        let index = groups.findIndex(item => item.id == group.id);
        if (index >= 0) {
            let updatedGroup = {
                ...groups[index],
                updatedAt: moment(),
                group_name: groupName,
                credentials: credentials,
            };
            groups[index] = updatedGroup;
            await saveItem(GROUP_ASYNC_ENUM.CREDENTIAL_GROUPS, JSON.stringify([...groups]));
        }
        else {
            throw { message: 'Unable to update group' }
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Fcuntion to delete credential group
 * @param {String} group 
 */
export const delete_credential_group = async (group) => {
    try {
        let groups = await fetch_all_groups();
        groups = groups.filter(item => item.id != group.id);
        await saveItem(GROUP_ASYNC_ENUM.CREDENTIAL_GROUPS, JSON.stringify(groups));
    } catch (error) {
        throw error;
    }
}

/**
 * Remove all groups
 */
export const remove_all_credentials_group = async () => {
    try {
        await saveItem(GROUP_ASYNC_ENUM.CREDENTIAL_GROUPS, JSON.stringify([]));
    } catch (error) {
        throw error;
    }
}

/**
 * Function to delete credential from local groups on deleting credential from credential screen
 * @param {String} credentialId 
 */
export const delete_credential_from_groups = async (credentialId) => {
    try {
        const groups = await fetch_all_groups();
        let updatedGroups = [];

        groups.forEach((group) => {
            let credArray = group.credentials.filter((c) => {
                return c.credentialId != credentialId
            });
            if (credArray.length > 0) {
                let newGroup = {
                    ...group,
                    credentials: credArray,
                };
                updatedGroups.push(newGroup);
            }
        });

        await saveItem(GROUP_ASYNC_ENUM.CREDENTIAL_GROUPS, JSON.stringify(updatedGroups))

    } catch (error) {
        throw error;
    }
}
