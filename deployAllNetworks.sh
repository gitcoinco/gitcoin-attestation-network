#!/bin/bash

# Create logs directory if it doesn't exist
mkdir -p deployment-logs

# Declare an associative array for networks (chain names only)
networks=(
#   "sepolia"
#   "optimism-sepolia"
#   "mainnet"
#   "optimism-mainnet"
#   "fantom-mainnet"
#   "celo-mainnet"
#   "arbitrum-mainnet"
#   "base"
#   "polygon"
#   "scroll"
)

# Get the current date and time for timestamping the logs
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")

# Loop through each network name and execute the bun deployResolver command, logging the output
for network in "${networks[@]}"; do
  log_file="deployment-logs/${network}_deploy_${timestamp}.log"
  echo "Deploying to $network"
  echo "Logs will be stored in $log_file"
  
  # Execute the command and redirect both stdout and stderr to the log file
  bun deployResolver --network "$network" > "$log_file" 2>&1
  
  # Check the exit status of the command
  if [ $? -eq 0 ]; then
    echo "$network deployment successful." | tee -a "$log_file"
  else
    echo "$network deployment failed. Check the log at $log_file for details." | tee -a "$log_file"
  fi
done
