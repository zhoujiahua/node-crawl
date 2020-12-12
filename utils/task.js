const schedule = require('node-schedule');
const { v4 } = require("uuid");

/**
 * * https://www.jianshu.com/p/8d303ff8fdeb
 * 
 * * * * * * *
 * ┬ ┬ ┬ ┬ ┬ ┬
 * │ │ │ │ │ |
 * │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
 * │ │ │ │ └───── month (1 - 12)
 * │ │ │ └────────── day of month (1 - 31)
 * │ │ └─────────────── hour (0 - 23)
 * │ └──────────────────── minute (0 - 59)
 * └───────────────────────── second (0 - 59, OPTIONAL)
 * 
 * * 6个占位符从左到右分别代表：秒、分、时、日、月、周几
 * * 表示通配符，匹配任意，当秒是*时，表示任意秒数都触发，其它类推
 * 
 * * 下面可以看看以下传入参数分别代表的意思
 * * 每分钟的第30秒触发： '30 * * * * *'
 * * 每小时的1分30秒触发 ：'30 1 * * * *'   
 * * 每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'   
 * * 每月的1日1点1分30秒触发 ：'30 1 1 1 * *'   
 * * 2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'   
 * * 每周1的1点1分30秒触发 ：'30 1 1 * * 1'
 * 
 */

// const scheduleCronstyle = (rule) => {
//     rule = rule || '* * * * * *';
//     schedule.scheduleJob(rule, () => {
//         console.log('scheduleCronstyle:' + Date.now());
//     });
// }


class TimeTask {
    TASK = [];
    constructor() { }
    startTask(rule, key) {
        let taskItem = {};
        taskItem.key = key || v4();
        taskItem.rule = rule || '30 1 1 * * *';
        taskItem.func = schedule.scheduleJob(taskItem.rule, () => console.log('The current task is executing:', taskItem.key, Date.now()));
        this.TASK.push(taskItem);
        return taskItem;
    }

    cancelTask(key) {
        let cancelItem = this.TASK.filter(item => (item.key == key) && (Object.assign({}, item, { state: item.func.cancel() })));
        this.TASK = this.TASK.filter(item => item.key != key);
        return cancelItem.length ? cancelItem[0] : null;
    }
}

module.exports = TimeTask