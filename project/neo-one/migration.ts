import { MigrationContracts } from '../src/neo-one-compiled';
export default ({ storage}: MigrationContracts, _network: string) => {
  storage.deploy()
};