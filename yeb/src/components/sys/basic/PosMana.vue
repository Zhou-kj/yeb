<template lang="">
    <div>
        <div>
            <el-input
                size="small"
                class="addPosInput"
                placeholder="请添加职位"
                suffix-icon="el-icon-plus"
                @keydown.enter.native="addPosition"
                v-model="pos.name">
            </el-input>
            <el-button icon="el-icon-plus" size="small" type="primary" @click="addPosition">添加</el-button>
        </div>
        <div>
            <el-table
                @selection-change="handleSelectionChange"
                stripe
                size="small"
                :data="positions"
                style="width: 70%">
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
                label="职位"
                width="120">
            </el-table-column>
            <el-table-column
                prop="createDate"
                label="创建时间"
                width="200">
            </el-table-column>
            <el-table-column
                prop="enabled"
                label="是否启用"
                width="120">
            </el-table-column>
            <el-table-column
                label="操作">
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
            title="编辑职位"
            :visible.sync="dialogVisible"
            width="30%">
            <div>
                <el-tag>职位名称</el-tag>
                <el-input v-model="updatePos.name" class="updatePosInput" size="small"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'PosMana',
    data() {
        return {
            dialogVisible: false,
            pos: {
                name: ''
            },
            updatePos: {
                name: ''
            },
            positions: [],
            multipleSelection: [],
        }
    },
    mounted() {
        this.initPositions()
    },
    methods: {
        deleteMany() {
            this.$confirm('是否删除选中职位, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const posid = this.multipleSelection
                this.deleteRequest('/system/basic/posd', posid).then(resp => {
                    if (resp) {
                        this.initPositions()
                    }
                })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })          
            })
        },  
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        doUpdate() {
            this.putRequest('/system/basic/pos', this.updatePos).then(resp => {
                if (resp) {
                    this.initPositions()
                    this.dialogVisible = false
                }
            })
        },  
        addPosition() {
            if (this.pos.name) {
                this.postRequest('/system/basic/pos', this.pos).then(resp => {
                    if (resp) {
                        this.initPositions()
                        this.pos.name = ''
                    }
                })
            } else {
                this.$message.error('职位名称不能为空！')
            }
        },

        showEditView(index, data) {
            Object.assign(this.updatePos, data)
            this.dialogVisible = true
        },
        handleDelete(idnex, data) {
            this.$confirm('是否删除['+data.name+'], 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/system/basic/pos', data).then(resp => {
                    if (resp) {
                        this.initPositions()
                    }
                })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })      
            })
        },

        initPositions() {
            this.getRequest('/system/basic/pos').then(resp => {
                if (resp) {
                    this.positions = resp
                }
            })
        }
    }
}
</script>
<style scoped>
    .addPosInput {
        width: 300px;
        margin-right: 8px;
        margin-bottom: 10px;
    }

    .updatePosInput {
        width: 200px;
        margin-left: 8px;
    }
</style>