---
title: "The Idiot uses Grafana and InfluxDB to monitor Proxmox"
description: "Setting up Grafana and InfluxDB inside a Proxmox container to build custom dashboards for your homelab."
pubDate: 2018-03-16
tags: ["proxmox", "grafana", "security"]
---

Custom and configurable data visualization? Yes, please.

Grafana is a data visualization tool that pulls in metrics from several data sources. For our purposes we'll be using [InfluxDB](https://en.wikipedia.org/wiki/InfluxDB) — a database geared towards time-based metrics.

For this instance, I'm using a template within Proxmox: **debian-9.0-standard_9.3-1_amd64.tar.gz** on a 64-bit platform. As long as you have a modern-ish version of Debian this guide should work just as well. We'll be using the CLI for the majority of configurations, and assuming you've issued `su` to root. If not, prefix your commands with `sudo`.

> **Note:** This guide does not cover securing this setup. Avoid using it in a production environment without adding security features.

## Setup

Whenever starting a new system, always perform a quick update first:

```bash
apt-get update && apt-get upgrade -y
```

### Install InfluxDB

```bash
apt-get install influxdb
```

Edit the InfluxDB config file:

```bash
nano /etc/influxdb/influxdb.conf
```

Uncomment and edit the `[udp]` section to reflect the following:

```
[[udp]]
  enabled = true
  bind-address = "0.0.0.0:8089"
  database = "proxmox"
  batch-size = 1000
  batch-timeout = "1s"
```

> **Note:** The database can be named anything — just remember what you called it when you add the data source in Grafana later. The port can also be anything available on your network, as long as it matches your entry in Proxmox's `status.cfg`.

![InfluxDB config](/images/influxdb-conf.png)

### Install Grafana

Check [docs.grafana.org](http://docs.grafana.org/installation/debian/) for the latest release. Use `wget` to download it (example uses 5.0.1):

```bash
wget https://s3-us-west-2.amazonaws.com/grafana-releases/release/grafana_5.0.1_amd64.deb
dpkg -i grafana_5.0.1_amd64.deb
```

### Configure Proxmox Status Reporting

Edit the PVE status config on your Proxmox node by creating `/etc/pve/status.cfg`:

```bash
nano /etc/pve/status.cfg
```

Add the following (make sure your port matches the entry in `influxdb.conf`):

```
influxdb:
  server your-server-ip-address
  port 8089
```

![Proxmox status config](/images/pve-status.png)

### Start Services

```bash
service influxdb start
service grafana-server start
systemctl enable influxdb
systemctl enable grafana-server
```

## Using Grafana

Navigate to `http://your-server-ip-address:3000`. You should see the Grafana login screen.

![Grafana login](/images/grafana-login.png)

The default credentials are `admin` / `admin`.

Once logged in, you'll be prompted to configure a data source. Fill in your InfluxDB details:

![Grafana data source configuration](/images/grafana-datasource.png)

Clicking **Save & Test** should confirm Grafana's connection to InfluxDB.

![Data source connected](/images/datasource-green.png)

## Building Dashboards

You can now create graphs using data pulled from Proxmox. Experiment by creating a new dashboard and adding panels. Here's an example **SingleStat** panel configuration for pulling CPU usage from a Proxmox host:

![SingleStat panel example 1](/images/singlestat1.png)

![SingleStat panel example 2](/images/singlestat2.png)

![Grafana dashboard overview](/images/grafanashot.png)
