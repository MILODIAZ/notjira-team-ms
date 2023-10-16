export enum RabbitMQ {
  ManagementQueue = 'management',
}

export enum UserMSG {
  CREATE = 'CREATE_USER',
  FIND_ALL = 'FIND_USERS',
  FIND_ONE = 'FIND_USER',
  UPDATE = 'UPDATE_USER',
  DELETE = 'DELETE_USER',
}

export enum TeamMSG {
  CREATE = 'CREATE_TEAM',
  FIND_ALL = 'FIND_TEAMS',
  FIND_ONE = 'FIND_TEAM',
  UPDATE = 'UPDATE_TEAM',
  DELETE = 'DELETE_TEAM',
  ADD_USER = 'ADD_USER',
  REMOVE_USER = 'REMOVE_USER',
}
