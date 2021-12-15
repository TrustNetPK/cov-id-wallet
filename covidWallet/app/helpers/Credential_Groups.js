/*
    Function related to credential groups feature
*/

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
export const _editCredentialGroup = (groupName, credentials) => {
    try {

    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @param {String} groupName 
 */
export const _deleteCredentialGroup = (groupName) => {
    try {

    } catch (error) {
        throw error;
    }
}