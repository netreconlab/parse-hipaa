module.exports = {
  apps : [{
    name        : "parse-hipaa",
    script      : "./index.js",
    ignore_watch: ["logs", "node_modules"],
    watch       : true,
    merge_logs  : true,
    cwd         : "/parse-server",
    exec_mode   : "cluster",
    instances   : 4 
  }]
}
