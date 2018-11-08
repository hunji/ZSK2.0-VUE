<template>
  <el-dialog  :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.type] + '名称'" prop="typeName">
        <el-input v-model="dataForm.typeName" :placeholder="dataForm.typeList[dataForm.type] + '名称'"></el-input>
      </el-form-item>
      <el-form-item label="上级主题" prop="parentName">
        <el-popover
          ref="typeListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="typeList"
            :props="typeListTreeProps"
            node-key="id"
            ref="typeListTree"
            @current-change="typeListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:typeListPopover :readonly="true" placeholder="点击选择上级菜单" class="type-list__input"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" label="排序号" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        typeName: '',
        description: '',
        type: 0,
        typeList: ['主题', '类型'],
        parentId: 0,
        parentName: '',
        orderNum: 0
      },
      dataRule: {
        typeName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      },
      typeList: [],
      typeListTreeProps: {
        label: 'typeName',
        children: 'children'
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.$http({
        url: this.$http.adornUrl('/knowledge/type/select'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.typeList = treeDataTranslate(data.typeList, 'id')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }).then(() => {
        if (!this.dataForm.id) {
          // 新增
          this.typeListTreeSetCurrentNode()
        } else {
          // 修改
          this.$http({
            url: this.$http.adornUrl(`/knowledge/type/info/${this.dataForm.id}`),
            mehtod: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.type = data.knowledgeType.type
              this.dataForm.typeName = data.knowledgeType.typeName
              this.dataForm.description = data.knowledgeType.description
              this.dataForm.id = data.knowledgeType.id
              this.dataForm.parentId = data.knowledgeType.parentId
              this.dataForm.orderNum = data.knowledgeType.orderNum
              this.typeListTreeSetCurrentNode()
            }
          })
        }
      })
    },
    // 类型树选中
    typeListTreeCurrentChangeHandle (data, node) {
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.typeName
    },
    // 类型树设置当前选中节点
    typeListTreeSetCurrentNode () {
      this.$refs.typeListTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.parentName = (this.$refs.typeListTree.getCurrentNode() || {})['typeName']
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/knowledge/type/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'typeName': this.dataForm.typeName,
              'description': this.dataForm.description,
              'type': this.dataForm.type,
              'parentId': this.dataForm.parentId,
              'orderNum': this.dataForm.orderNum
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>