<template lang="">
    <div>
        <div>
            <el-input size="small" v-model="jl.name" placeholder="请输入职称" prefix-icon="el-icon-plus" style="width:300px;"></el-input>
            <el-select size="small" style="margin-left: 6px; margin-right: 6px;" v-model="jl.titleLevel" placeholder="请选择职称等级">
                <el-option
                  v-for="item in titleLevels"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="addJobLevel">添加</el-button>
        </div>
        <div style="margin-top: 10px;">
            <el-table
            @selection-change="handleSelectionChange"
            size="small"
            :data="jls"
            stripe
            style="width: 75%">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
              prop="id"
              label="编号"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="职称名"
              width="150">
            </el-table-column>
            <el-table-column
              prop="titleLevel"
              label="职称等级"
              width="150">
            </el-table-column>
            <el-table-column
              prop="createDate"
              label="创建日期"
              width="200">
            </el-table-column>
            <el-table-column
              prop="enabled"
              label="是否启用"
              width="150">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.enabled == 1" type="success" >已启用</el-tag>
                    <el-tag v-else type="danger" size="normal"  >未启用</el-tag>
                </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="showEditView(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
        </div>
        <el-button size="small" style="margin-top: 8px;" type="danger" :disabled="this.multipleSelection.length == 0" @click="deleteMany">批量删除</el-button>
        <el-dialog
            title="编辑职称"
            :visible.sync="dialogVisible"
            width="30%">
            <table>
                <tr>
                    <td>
                        <el-tag>职称名称</el-tag>
                    </td>
                    <td>
                        <el-input v-model="updateJl.name" size="small" style="margin-left: 6px;"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>
                        <el-tag>职称等级</el-tag>
                    </td>
                    <td>
                        <el-select size="small" style="margin-left: 6px; margin-right: 6px;" v-model="updateJl.titleLevel" placeholder="请选择职称等级">
                            <el-option
                              v-for="item in titleLevels"
                              :key="item"
                              :label="item"
                              :value="item">
                            </el-option>
                          </el-select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <el-tag>是否启用</el-tag>
                    </td>
                    <td>
                        <el-switch
                        v-model="updateJl.enabled"
                        active-text="已启用"
                        inactive-text="未启用"
                        style="margin-left:6px;">
                      </el-switch>
                    </td>
                </tr>
            </table>
            <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'JobLevelMana',
    data() {
        return {
            multipleSelection: [],
            updateJl: {
                name: '',
                titleLevel: '',
                enabled: false
            },
            dialogVisible: false,
            jl: {
                name: '',
                titleLevel: '',
            },
            titleLevels: [
                '正高级',
                '副高级',
                '中级',
                '初级',
                '员级',
            ],
            jls: []
        }
    },
    mounted() {
        this.initJls()
    },  
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        deleteMany() {
            this.$confirm('是否删除选中职位, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const posid = this.multipleSelection
                this.deleteRequest('/system/basic/joblevels', posid).then(resp => {
                    if (resp) {
                        this.initJls()
                    }
                })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })          
            })
        },  
        doUpdate() {
            this.putRequest('/system/basic/joblevel', this.updateJl).then(resp => {
                if (resp) {
                    this.initJls()
                    this.dialogVisible = false
                }
            })
        },
        showEditView(index, data) {
            data.enabled = data.enabled == 1 ? true : false
            Object.assign(this.updateJl, data)
            this.dialogVisible = true;
        },  
        handleDelete(index, data){
            this.$confirm('是否删除['+data.name+'], 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/system/basic/joblevel', data).then(resp => {
                    if (resp) {
                        this.initJls()
                    }
                })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })
            })
        },
        addJobLevel() {
            if (this.jl.name && this.jl.titleLevel) {
                this.postRequest('/system/basic/joblevel', this.jl).then(resp => {
                    if (resp) {
                        this.initJls()
                        this.jl.name = ''
                        this.jl.titleLevel = ''
                    }
                })
            }else {
                this.$message.error('字段不能为空！')
            }
        },
        initJls() {
            this.getRequest('/system/basic/joblevel').then(resp => {
                if (resp) {
                    this.jls = resp
                }
            })
        }
    }
}
</script>
<style scoped>
    
</style>