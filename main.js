import fs from 'node:fs/promises';
import path from 'node:path';
import { homedir } from 'node:os';
import YAML from 'yaml';

import { CLUSTERS_CONFIG_FOLDER, KUBE_CONFIG_FOLDER } from './config.js';

const clustersDir = path.resolve(homedir(), CLUSTERS_CONFIG_FOLDER);

const main = async () => {
  const files = await fs.readdir(clustersDir);

  // Read and process all cluster configs
  const allConfigs = await Promise.all(
    files.map(filename => readAClusterConfig(filename))
  );

  // Merge all configs into one
  const mergedConfig = allConfigs.reduce((merged, config) => {
    merged.clusters.push(...config.clusters);
    merged.contexts.push(...config.contexts);
    merged.users.push(...config.users);
    return merged;
  }, {
    apiVersion: 'v1',
    kind: 'Config',
    clusters: [],
    contexts: [],
    users: [],
    'current-context': '',
    preferences: {}
  });

  const kubeConfigPath = path.resolve(homedir(), KUBE_CONFIG_FOLDER,  'config');
  await fs.writeFile(kubeConfigPath, YAML.stringify(mergedConfig), 'utf8');
  console.log(`Merged k8s config written to ${kubeConfigPath}`);

  return mergedConfig;
};

const readAClusterConfig = async (clusterName) => {
  const file = await fs.readFile(path.resolve(`${clustersDir}/${clusterName}`), 'utf8')
  const content = YAML.parse(file)

  content.clusters.map(cluster => {
    cluster.name += `-${clusterName}`
    return cluster
  });

  content.users.map(user => {
    user.name += `-${clusterName}`
    return user
  });

  content.contexts.map(ctx => {
    ctx.name += `-${clusterName}`
    ctx.context.cluster += `-${clusterName}`
    ctx.context.user += `-${clusterName}`
    return ctx
  });

  return content;
};

main()
  .catch(error => {
    console.error('Error in mkc:', error);
    process.exit(1);
  });
