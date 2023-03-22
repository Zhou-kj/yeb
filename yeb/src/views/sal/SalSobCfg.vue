<template lang="">
    <div>
        <el-table :data="emps" border stripe size="small">
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                fixed
                align="center"
                width="120">
            </el-table-column>
            <el-table-column
                prop="workID"
                label="工号"
                width="120">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱地址"
                width="200">
            </el-table-column>
            <el-table-column
                prop="phone"
                label="电话号码"
                width="120">
            </el-table-column>
            <el-table-column
                prop="pname"
                label="职位"
                align="center"
                width="120">
            </el-table-column>
            <el-table-column
                label="工资账套"
                align="center">
                <template slot-scope="scope">
                    <el-tooltip placement="right" v-if="scope.row.sname">
                        <div slot="content">
                            <table>
                                <tr>
                                    <td>基本工资</td>
                                    <td>{{ scope.row.sbasicSalary }}</td>
                                </tr>
                                <tr>
                                    <td>交通补助</td>
                                    <td>{{ scope.row.strafficaSalary }}</td>
                                </tr>
                                <tr>
                                    <td>午餐补助</td>
                                    <td>{{ scope.row.slunchSalary }}</td>
                                </tr>
                                <tr>
                                    <td>奖金</td>
                                    <td>{{ scope.row.sbonus }}</td>
                                </tr>
                                <tr>
                                    <td>养老金比率</td>
                                    <td>{{ scope.row.spensionPer }}</td>
                                </tr>
                                <tr>
                                    <td>养老金基数</td>
                                    <td>{{ scope.row.spensionBase }}</td>
                                </tr>
                                <tr>
                                    <td>医疗保险比率</td>
                                    <td>{{ scope.row.smedicalPer }}</td>
                                </tr>
                                <tr>
                                    <td>医疗保险基数</td>
                                    <td>{{ scope.row.smedicalBase }}</td>
                                </tr>
                                <tr>
                                    <td>公积金比率</td>
                                    <td>{{ scope.row.saccumulationPer }}</td>
                                </tr>
                                <tr>
                                    <td>公积金基数</td>
                                    <td>{{ scope.row.saccumulationFundBase }}</td>
                                </tr>
                            </table>
                        </div>
                        <el-tag>{{ scope.row.sname}}</el-tag>
                    </el-tooltip>
                    <el-tag v-else>暂未设置</el-tag></el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-popover
                        placement="left"
                        title="编辑工资账套"
                        width="200"
                        @show="showPop(scope.row)"
                        @hide="hidePop(scope.row)"
                        trigger="click">
                        <div>
                            <el-select v-model="currentSalary" placeholder="请选择" >
                                <el-option v-for="item in salaries"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <el-button slot="reference" type="danger" size="small">修改工资账套</el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <div style="display: flex; justify-content: flex-end; margin-top: 5px;">
            <el-pagination
                background
                @size-change="sizeChange"
                @current-change="currentChange"
                layout="sizes, prev, pager, next, jumper, ->, total, slot"
                :total="total">
          </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    name: 'SalSobCfg',
    data() {
        return {
            emps: [],
            currentPage: 1,
            size: 10,
            total: 0,
            salaries: [],
            currentSalary: null,
        }
    },
    mounted() {
        this.initEmps()
        this.initSalaries()
    },
    methods: {
        hidePop(data) {
            let temp = new Object()
            temp.id = data.id
            temp.salaryId = this.currentSalary
            if (this.currentSalary && this.currentSalary != data.sid){
                this.putRequest('/salary/sobcfg', temp).then(resp => {
                    if (resp) {
                        this.initEmps()
                    }
                })
            }
        },
        showPop(data) {
            if (data) {
                this.currentSalary = data.sid
            }else {
                this.currentSalary = null
            }
        },
        initSalaries() {
            this.getRequest('/salary/sob').then(resp => {
                if (resp) {
                    this.salaries = resp
                }
            })
        },
        sizeChange(size) {
            this.size = size
            this.initEmps()
        },
        currentChange(page) {
            this.currentPage = page
            this.initEmps()
        },
        initEmps() {
            this.getRequest('/salary/sobcfg?currentPage='+this.currentPage+'&size='+this.size).then(resp => {
                if (resp) {
                    this.emps = resp.data
                    this.total = resp.total
                }
            })
        }
    }
}
</script>
<style lang="">
    
</style>