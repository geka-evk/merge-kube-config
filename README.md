# Kubernetes Config Merger (`mkc`)

## Description

This project provides a utility for merging multiple Kubernetes cluster configuration files into a single valid kubeconfig file. It reads cluster-specific configurations from individual YAML files located in a designated folder and combines them into a unified configuration file that can be used by Kubernetes CLI tools like `kubectl`.

The tool is designed to work with the default Kubernetes configuration directory structure within the user's home directory.

## How It Works

- **Input:** The project reads individual cluster configuration files from a directory named `clusters` located inside the `.kube` folder in the user's home directory.
- **Processing:**
    - Reads and parses each YAML file.
    - Adjusts the naming for clusters, contexts, and users by appending the file name (cluster name) to ensure unique identification.
    - Merges all configurations into a single YAML structure, maintaining API version and conventions.
- **Output:** The merged configuration is written to the default kubeconfig file (`~/.kube/config`) that tools like `kubectl` use.

## Requirements

To use this project, ensure the following:

- **Node.js** installed.
- Write permissions to the `.kube` folder inside your home directory for saving the merged configuration.

## File Structure

This utility expects the following file/directory structure in your home directory:

```text
~/
   ├──📁 .kube/
   │   ├──📁 clusters/ 
   │   │   ├── cluster1.yaml
   │   │   ├── cluster2.yaml
   │   │   └── ... (one YAML file per cluster)
   │   └── config # Output file containing the merged configuration
```
- **`.kube/clusters/`**: Input folder containing cluster-specific Kubernetes configuration files.
- **`.kube/config`**: Final output file with all cluster configurations merged.

Each file in the `clusters` folder should be a valid Kubernetes configuration YAML file.

## Installation

1. Clone this repository to your local system:

   ```bash
   git clone <repository-url>
   ```

2. Install required dependencies:

   ```bash
   cd <project-directory>
   npm install
   ```

## Usage

1. Run the following command to start merging Kubernetes configuration files:

    ```bash
    node main.js
    ```

2. Add as `alias` to `.bashrc`, and use as CLI command

    ```.bashrc
    alias mkc='node <project-directory>/main.js'
    ```
   
    ```bash
    mkc
    ```

### Output
The script will generate (or overwrite) a kubeconfig file located at `/.kube/config`
