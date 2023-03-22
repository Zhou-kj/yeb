<template>
    <div>
        <div style="display:flex;justify-content:space-between">
            <div>
                <el-input @clear="initEmps" clearable  @keydown.enter.native="initEmps" v-model="empName" style="width: 300px; margin-right: 10px;" placeholder="请输入员工姓名进行搜索" size="small" prefix-icon="el-icon-search"></el-input>
                <el-button type="primary" size="small" icon="el-icon-search" @click="initEmps">搜索</el-button>
                <el-button type="primary" size="small" @click="showAdvanceSearchVisible = !showAdvanceSearchVisible"><i :class="showAdvanceSearchVisible? 'fa fa-angle-double-up' : 'fa fa-angle-double-down'" aria-hidden="true"></i>高级搜索</el-button>
            </div>
            <div>
              <el-upload
              style="display:inline-block; margin-right: 8px"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="onSuccess"
              :on-error="onError"
              :disabled="importDataDisabled"
              action="https://jsonplaceholder.typicode.com/posts/">
              <el-button :disabled="importDataDisabled" style="background-color: #68B138;color:white" type="sucess" size="small" :icon="importDataBtnIcon" @click="">{{ importDataBtnText }}</el-button>
            </el-upload>
                <el-button style="background-color: #68B138;color:white" type="sucess" size="small" icon="el-icon-download" @click="exportData">导出数据</el-button>
                <el-button type="primary" size="small" @click="showAddEmp" icon="el-icon-plus">添加员工</el-button>
            </div>
        </div>
        <transition name="slide-fade">
        <div v-show="showAdvanceSearchVisible" style="border: 1px solid #409eff; border-radius: 5px;box-sizing: border-box;padding:5px;margin: 10px 0px;">
          <el-row>
            <el-col :span="5">
              政治面貌：
              <el-select v-model="searchValue.politicId" placeholder="请选择政治面貌" clearable size="mini" style="width: 130px;">
                <el-option v-for="item in politicsstatus"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              民族：
              <el-select v-model="searchValue.nationId" placeholder="请选择民族" size="mini" clearable style="width: 130px;">
                <el-option v-for="item in nations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              职位：
              <el-select v-model="searchValue.posId" placeholder="职位" size="mini" style="width: 120px;">
                <el-option v-for="item in positions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              职称：
              <el-select v-model="searchValue.jobLevelId" placeholder="职称" size="mini" style="width: 130px;">
                <el-option v-for="item in jobLevel"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              聘用形式：
              <el-radio-group v-model="searchValue.engageForm" >
                <el-radio label="劳动合同">劳动合同</el-radio>
                <el-radio label="劳务合同">劳务合同</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              所属部门：
              <el-popover
                      placement="bottom"
                      title="请选择部门"
                      width="200"
                      trigger="manual"
                      v-model="visible2">
                    <el-tree :data="allDeps"
                             :props="defaultProps"
                             :expand-on-click-node="false"
                             default-expand-all
                             @node-click="searchHandleNodeClick"></el-tree>
                    <div slot="reference"
                         style="width:130px;display: inline-flex;
                         border-radius: 5px;border: 1px solid #dedede;height: 28px;cursor: pointer;align-items: center;
                         font-size: 12px;padding-left: 8px;margin-top: 8px;box-sizing: border-box;"
                         @click="showDepView2">{{ inputDepName }}
                    </div>
                  </el-popover>
            </el-col>
            <el-col :span="10">
              入职日期：
              <el-date-picker
              style="margin-top:10px;"
              size="small"
              v-model="searchValue.beginDateScope"
              type="daterange"
              value-format="yyyy-MM-dd"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            </el-col>
            <el-col :span="5" :offset="4" style="margin-top:10px;">
              <el-button type="primary" size="mini" @click="cancelSearch">取消</el-button>
              <el-button icon="el-icon-search" type="primary" size="mini" @click="initEmps">搜索</el-button>
            </el-col>
          </el-row>
        </div>
        </transition>
        <div>
            <el-table
            :data="emps"
            stripe
            border
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="70"
              fixed="left">
            </el-table-column>
            <el-table-column
              prop="workID"
              label="工号"
              width="90">
            </el-table-column>
            <el-table-column
              prop="gender"
              label="性别"
              width="50">
            </el-table-column>
            <el-table-column
              prop="birthday"
              label="出生日期"
              width="100">
            </el-table-column>
            <el-table-column
              prop="idCard"
              label="身份证号码"
              width="170">
            </el-table-column>
            <el-table-column
              prop="wedlock"
              label="婚姻状况"
              width="80">
            </el-table-column>
            <el-table-column
              prop="nname"
              label="民族"
              width="50">
            </el-table-column>
            <el-table-column
              prop="nativePlace"
              label="籍贯"
              width="100">
            </el-table-column>
            <el-table-column
              prop="pname"
              label="政治面貌"
              width="120">
            </el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"
              width="200">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="电话号码"
              width="120">
            </el-table-column>
            <el-table-column
              prop="address"
              label="联系地址"
              width="320">
            </el-table-column>
            <el-table-column
              prop="dname"
              label="所属部门"
              width="100">
            </el-table-column>
            <el-table-column
              prop="posname"
              label="职位"
              width="100">
            </el-table-column>
            <el-table-column
              prop="engageForm"
              label="聘用形式"
              width="100">
            </el-table-column>
            <el-table-column
              prop="tiptopDegree"
              label="最高学历"
              width="80">
            </el-table-column>
            <el-table-column
              prop="school"
              label="毕业院校"
              width="150">
            </el-table-column>
            <el-table-column
            prop="specialty"
            label="专业"
            width="150">
          </el-table-column>
          <el-table-column
              prop="workState"
              label="在职状态"
              width="80">
            </el-table-column>
            <el-table-column
              prop="beginDate"
              label="入职日期"
              width="100">
            </el-table-column>
            <el-table-column
              prop="conversionTime"
              label="转正日期"
              width="100">
            </el-table-column>
            <el-table-column
              prop="beginContract"
              label="合同起始日期"
              width="120">
            </el-table-column>
            <el-table-column
              prop="endContract"
              label="合同截止日期"
              width="120">
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
                fixed="right">
              <template slot-scope="scope">
                    <el-button style="padding:3px;" size="mini" @click="showEditEmp(scope.row)">编辑</el-button>
                    <!-- <el-button type="primary" size="default" @click="">查看高级资料</el-button> -->
                    <el-button style="padding:3px;" type="danger" size="mini" @click="delEmp(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display:flex; justify-content: flex-end;">
            <el-pagination
            background
            @size-change="sizeChange"
            @current-change="currentChange"
            layout="sizes, prev, pager, next, jumper, ->, total, slot"
            :total="total">
          </el-pagination>
          </div>
        </div>
        <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="80%">
        <div>
          <el-form :model="emp" ref="empForm" :rules="rules">
            <el-row>
              <el-col :span="6">
                <el-form-item label="姓名:" prop="name">
                  <el-input prefix-icon="el-icon-edit" style="width: 150px;" v-model="emp.name" placeholder="请输入员工姓名" size="mini" clearable @change=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item v-model="emp.gender" label="性别:" size="normal" prop="gender">
                  <el-radio-group v-model="emp.gender" style="margin-top: 5px;">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出生日期:" size="normal" prop="birthday">
                  <el-date-picker v-model="emp.birthday" type="date" value-format="yyyy-MM-dd" placeholder="请输入日期" size="mini" style="width:150px;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="政治面貌:" prop="politicId" size="normal">
                  <el-select v-model="emp.politicId" placeholder="请选择政治面貌" clearable size="mini" style="width: 200px;">
                    <el-option v-for="item in politicsstatus"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="民族:" prop="nationId" size="normal">
                  <el-select v-model="emp.nationId" placeholder="请选择民族" size="mini" clearable style="width: 150px;">
                    <el-option v-for="item in nations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="籍贯:" prop="nativePlace" size="normal">
                  <el-input v-model="emp.nativePlace" placeholder="籍贯" prefix-icon="el-icon-edit" size="small"
                          style="width: 120px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="电子邮箱:" prop="email">
                  <el-input v-model="emp.email" placeholder="请输入电子邮箱" prefix-icon="el-icon-message" size="mini"
                            style="width: 150px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="联系地址:" prop="address">
                  <el-input v-model="emp.address" placeholder="请输入联系地址" prefix-icon="el-icon-edit" size="mini"
                            style="width: 200px;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="职位:" prop="posId">
                  <el-select v-model="emp.posId" placeholder="职位" size="mini" style="width: 150px;">
                    <el-option v-for="item in positions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="职称:" prop="jobLevelId">
                  <el-select v-model="emp.jobLevelId" placeholder="职称" size="mini" style="width: 150px;">
                    <el-option v-for="item in jobLevel"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="所属部门:" prop="departmentId">
                  <el-popover
                      placement="right"
                      title="请选择部门"
                      width="200"
                      trigger="manual"
                      v-model="visible">
                    <el-tree :data="allDeps"
                             :props="defaultProps"
                             :expand-on-click-node="false"
                             default-expand-all
                             @node-click="handleNodeClick"></el-tree>
                    <div slot="reference"
                         style="width:150px;display: inline-flex;
                         border-radius: 5px;border: 1px solid #dedede;height: 28px;cursor: pointer;align-items: center;
                         font-size: 12px;padding-left: 8px;margin-top: 8px;box-sizing: border-box;"
                         @click="showDepView">{{ inputDepName }}
                    </div>
                  </el-popover>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="电话号码:" prop="phone">
                  <el-input v-model="emp.phone" placeholder="请输入电话号码" size="mini" style="width: 200px;"
                            prefix-icon="el-icon-phone"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="工号:" prop="workID">
                  <el-input disabled v-model="emp.workID" placeholder="请输入工号" size="mini" style="width: 150px;"
                            prefix-icon="el-icon-edit"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="学历:" prop="tiptopDegree">
                  <el-select v-model="emp.tiptopDegree" placeholder="职称" size="mini" style="width: 150px;">
                    <el-option v-for="item in tiptopDegree"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="毕业院校:" prop="school">
                  <el-input v-model="emp.school" placeholder="请输入学校" size="mini" style="width: 150px;"
                            prefix-icon="el-icon-edit"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="专业名称:" prop="specialty">
                  <el-input v-model="emp.specialty" placeholder="请输入专业名称" size="mini" style="width: 200px;"
                            prefix-icon="el-icon-edit"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="入职日期:" prop="beginDate">
                  <el-date-picker
                      v-model="emp.beginDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      size="mini"
                      style="width: 120px;"
                      placeholder="入职日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="转正日期:" prop="conversionTime">
                  <el-date-picker
                      v-model="emp.conversionTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      size="mini"
                      style="width: 120px;"
                      placeholder="转正日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同起始日期:" prop="beginContract">
                  <el-date-picker
                      v-model="emp.beginContract"
                      type="date"
                      value-format="yyyy-MM-dd"
                      size="mini"
                      style="width: 135px;"
                      placeholder="合同起始日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="合同截止日期:" prop="endContract">
                  <el-date-picker
                      v-model="emp.endContract"
                      type="date"
                      value-format="yyyy-MM-dd"
                      size="mini"
                      style="width: 170px;"
                      placeholder="合同截止日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="身份证号码:" prop="idCard">
                  <el-input v-model="emp.idCard" placeholder="请输入身份证号码"
                            size="mini" prefix-icon="el-icon-edit" style="width: 180px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="聘用形式:" prop="engageForm">
                  <el-radio-group v-model="emp.engageForm" style="margin-top: 8px;">
                    <el-radio label="劳动合同">劳动合同</el-radio>
                    <el-radio label="劳务合同">劳务合同</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="婚姻状况:" prop="wedlock">
                  <el-radio-group v-model="emp.wedlock" style="margin-top: 8px;">
                    <el-radio label="未婚">未婚</el-radio>
                    <el-radio label="已婚">已婚</el-radio>
                    <el-radio label="离异">离异</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="doAddEmp">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'EmpBasic',
    data() {
        return {
            searchValue: {
              politicId: null,
              nationId: null,
              posId: null,
              jobLevel: null,
              engageForm: null,
              departmentId: null,
              beginDateScope: null,

            },
            showAdvanceSearchVisible: false,
            importDataDisabled: false,
            importDataBtnText: '导入数据',
            importDataBtnIcon: 'el-icon-upload2',
            title: '',
            options: [],
            inputDepName: '',
            defaultProps: {
              children: 'children',
              label: 'name'
            },
            allDeps: [],
            visible: false,
            visible2: false,
            tiptopDegree: ['博士','硕士','本科','大专','高中','初中','小学','其他'],
            nations: [],
            jobLevel: [],
            politicsstatus: [],
            positions: [],
            loading: false,
            total: 0,
            emps: [],
            page: 1,
            size: 10,
            empName: '',
            dialogVisible: false,
            emp: {
              id: null,
              name: '',
              gender: '',
              birthday: '',
              idCard: '',
              wedlock: '',
              nationId:  null,
              nativePlace: '',
              politicId: null,
              email: '',
              phone: '',
              address: '',
              departmentId: null,
              jobLevelId: null,
              posId: '',
              engageForm: '',
              tiptopDegree: '',
              specialty: '',
              school: '',
              beginDate: '',
              workState: '在职',
              workID: '',
              contractTerm: null,
              conversionTime: '',
              notWorkDate: null,
              beginContract: '',
              endContract: '',
              workAge: null,
              salaryId: null,
            },
            rules: {
              name: [{required: true, message: '请输入员工姓名', trigger: 'blur'}],
              gender: [{required: true, message: '请输入员工性别', trigger: 'blur'}],
              birthday: [{required: true, message: '请输入员工出生日期', trigger: 'blur'}],
              idCard: [{required: true, message: '请输入员工身份证号码', trigger: 'blur'},{pattern:/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, message: '身份证号码不正确', trigger: 'blur'}],
              wedlock: [{required: true, message: '请输入员工婚姻状况', trigger: 'blur'}],
              nationId: [{required: true, message: '请输入员工民族', trigger: 'blur'}],
              nativePlace: [{required: true, message: '请输入员工籍贯', trigger: 'blur'}],
              politicId: [{required: true, message: '请输入员工政治面貌', trigger: 'blur'}],
              email: [{required: true, message: '请输入员工邮箱地址', trigger: 'blur'},{type: 'email', message: '邮箱地址格式不正确', trigger: 'blur'}],
              phone: [{required: true, message: '请输入员工电话', trigger: 'blur'}],
              address: [{required: true, message: '请输入员工地址', trigger: 'blur'}],
              departmentId: [{required: true, message: '请输入员工部门', trigger: 'blur'}],
              jobLevelId: [{required: true, message: '请输入员工职称', trigger: 'blur'}],
              posId: [{required: true, message: '请输入员工职位', trigger: 'blur'}],
              engageForm: [{required: true, message: '请输入员工聘用形式', trigger: 'blur'}],
              tiptopDegree: [{required: true, message: '请输入员工学历', trigger: 'blur'}],
              specialty: [{required: true, message: '请输入员工专业', trigger: 'blur'}],
              school: [{required: true, message: '请输入员工毕业院校', trigger: 'blur'}],
              beginDate: [{required: true, message: '请输入员工入职日期', trigger: 'blur'}],
              workState: [{required: true, message: '请输入员工工作状态', trigger: 'blur'}],
              workID: [{required: true, message: '请输入员工工号', trigger: 'blur'}],
              contractTerm: [{required: true, message: '请输入员工合同期限', trigger: 'blur'}],
              conversionTime: [{required: true, message: '请输入员工转正日期', trigger: 'blur'}],
              notWorkDate: [{required: true, message: '请输入员工离职日期', trigger: 'blur'}],
              beginContract: [{required: true, message: '请输入员工合同其实日期', trigger: 'blur'}],
              endContract: [{required: true, message: '请输入员工合同结束日期', trigger: 'blur'}],
              workAge: [{required: true, message: '请输入员工工龄', trigger: 'blur'}],
            }
        }
    },
    mounted() {
        this.initEmps() 
        this.initData()
        this.initPositions()
    },
    methods: {
      cancelSearch(){
        this.showAdvanceSearchVisible = !this.showAdvanceSearchVisible
        this.initEmps()
        this.loading = false
      },
      onSuccess() {
        this.importDataBtnIcon = 'el-icon-upload2'
        this.importDataBtnText = '导入数据'
        this.initEmps()
        this.importDataDisabled = false
      },
      onError() {
        this.importDataBtnIcon = 'el-icon-upload2'
        this.importDataBtnText = '导入数据'
        this.importDataDisabled = false
      },
      beforeUpload() {
        this.importDataBtnIcon = 'el-icon-loading'
        this.importDataBtnText = '正在导入'
        this.importDataDisabled = true
      },
      exportData() {
        this.downloadRequest('/employee/basic/export').then(resp => {
           // 将响应数据处理为Blob类型
            var blob = new Blob([resp])
            console.log(resp.data)
            // 创建一个URL对象
            var url = window.URL.createObjectURL(blob)
            // 创建一个a标签
            var a = document.createElement("a")
            a.href = url
            a.download = "员工数据.txt"// 这里指定下载文件的文件名
            a.click()
            // 释放之前创建的URL对象
            window.URL.revokeObjectURL(url)
        }).catch(function (reason) {
            console.log(reason)
        })
      },
      cancel(){
        this.dialogVisible = false
        this.visible = false
      },
      showEditEmp(data) {
        this.initPositions()
        this.inputDepName = data.dname
        this.title = '编辑员工信息'
        this.emp = data
        this.dialogVisible = true
      },
      doAddEmp() {
        if (this.emp.id) {
          this.$refs['empForm'].validate((valid) => {
          if (valid) {
            this.putRequest('/employee/basic', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false
                this.initEmps()
              }
            })
          }
        })
        }else {
          this.$refs['empForm'].validate((valid) => {
          if (valid) {
            this.postRequest('/employee/basic', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false
                this.initEmps()
              }
            })
          }
        })
        }
      },
      handleNodeClick(data) {
        this.inputDepName = data.name
        this.emp.departmentId = data.id 
        this.visible = !this.visible
      },
      searchHandleNodeClick(data) {
        this.inputDepName = data.name
        this.searchValue.departmentId = data.id
        this.visible2 = !this.visible2
      },
      showDepView() {
        this.visible = !this.visible
      },
      showDepView2() {
        this.visible2 = !this.visible2
      },
      getMaxWorkId() {
        this.getRequest('/system/basic/workId').then(resp => {
          if (resp) {
            this.emp.workID = '00000'+resp.data
          }
        })
      },
      initPositions() {
        this.getRequest('/system/basic/positions').then(resp => {
            if (resp) {
              this.positions = resp
            }
          })
      },
      initData() {
        if (!window.sessionStorage.getItem('nations')) {
          this.getRequest('/system/basic/nation').then(resp => {
            if (resp) {
              this.nations = resp
              window.sessionStorage.setItem('nations', JSON.stringify(resp))
            }
          })
        } else {
          this.nations = JSON.parse(window.sessionStorage.getItem('nations'))
        }
        if (!window.sessionStorage.getItem('jobLevel')) {
          this.getRequest('/system/basic/jobLevel').then(resp => {
            if (resp) {
              this.jobLevel = resp
              window.sessionStorage.setItem('jobLevel', JSON.stringify(resp))
            }
          })
        } else {
          this.jobLevel = JSON.parse(window.sessionStorage.getItem('jobLevel'))
        }
        if (!window.sessionStorage.getItem('politicsstatus')) {
          this.getRequest('/system/basic/politicsstatus').then(resp => {
            if (resp) {
              this.politicsstatus = resp
              window.sessionStorage.setItem('politicsstatus', JSON.stringify(resp))
            }
          })
        } else {
          this.politicsstatus = JSON.parse(window.sessionStorage.getItem('politicsstatus'))
        }
        if (!window.sessionStorage.getItem('allDeps')) {
          this.getRequest('/system/basic/department').then(resp => {
            if (resp) {
              this.allDeps = resp
              window.sessionStorage.setItem('allDeps', JSON.stringify(resp))
            }
          })
        } else {
          this.allDeps = JSON.parse(window.sessionStorage.getItem('allDeps'))
        }
      },
      showAddEmp() {
        this.inputDepName = ''
        this.title = '添加员工'
        this.dialogVisible = true
        this.emp = {
              id: null,
              name: '',
              gender: '',
              birthday: '',
              idCard: '',
              wedlock: '',
              nationId:  null,
              nativePlace: '',
              politicId: null,
              email: '',
              phone: '',
              address: '',
              departmentId: null,
              jobLevelId: null,
              posId: '',
              engageForm: '',
              tiptopDegree: '',
              specialty: '',
              school: '',
              beginDate: '',
              workState: '在职',
              workID: '',
              contractTerm: null,
              conversionTime: '',
              notWorkDate: null,
              beginContract: '',
              endContract: '',
              workAge: null,
              salaryId: null,
            }
        this.initPositions()
        this.getMaxWorkId()
      },
      sizeChange(size) {
        this.size = size
        this.initEmps()
      },
      currentChange(currentPage) {
        this.page = currentPage
        this.initEmps()
      },
      delEmp(data) {
          this.$confirm('是否删除'+data.name+'--'+data.id+', 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/employee/basic', data).then(resp => {
                    if (resp) {
                        this.initEmps()
                    }
                })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })      
            })
        },  
      initEmps() {
          this.loading = true
          let url = '/employee/basic/?currentPage='+this.page+'&size='+this.size
            if (this.searchValue.politicId) {
              url += '&politicId='+this.searchValue.politicId
              this.searchValue.politicId = null
            }
            if (this.searchValue.nationId) {
              url += '&nationId='+this.searchValue.nationId
              this.searchValue.nationId = null
            }
            if (this.searchValue.posId) {
              url += '&posId='+this.searchValue.posId
              this.searchValue.posId = null
            }
            if (this.searchValue.jobLevelId) {
              url += '&jobLevelId='+this.searchValue.jobLevelId
              this.searchValue.jobLevelId = null
            }
            if (this.searchValue.engageForm) {
              url += '&engageForm='+this.searchValue.engageForm
              this.searchValue.engageForm = null
            }
            if (this.searchValue.departmentId) {
              url += '&departmentId='+this.searchValue.departmentId
              this.searchValue.departmentId = null
            }
            if (this.searchValue.beginDateScope) {
              url += '&beginDateScope='+this.searchValue.beginDateScope
              this.searchValue.beginDateScope = null
            }else{
              url += '&name='+this.empName
          }
            this.getRequest(url).then(resp => {
              this.loading = false  
              if (resp) {
                    this.emps = resp.data
                    this.total = resp.total
                }
            })
        }
    }
}
</script>
<style scoped>
  .slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
    .slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>