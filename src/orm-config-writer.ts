import * as fs from 'fs';
import * as path from 'path';

import { rootPath } from 'get-root-path';
import { Config } from './config/config';

function writeOrmConfig() {
    const { typeorm } = Config;
    // @ts-ignore
    typeorm.entities = undefined;
    // @ts-ignore
    typeorm.subscribers = undefined;
    typeorm.autoLoadEntities = false;

    const dir = path.join(rootPath, 'ormconfig.json');
    fs.writeFileSync(
        dir,
        JSON.stringify(typeorm, null, 2),
    );
}

writeOrmConfig();
