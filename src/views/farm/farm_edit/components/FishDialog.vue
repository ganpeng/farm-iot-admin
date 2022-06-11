<template>
  <el-dialog
    :title="title"
    class="my-dialog no-footer-border"
    width="70%"
    :visible.sync="visible"
    :show-close="true"
    @open="openDialogHandler"
    :before-close="beforeCloseHandler"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="dialog-body">
      <div class="plant-protection-detail-container">
        <div class="steps">
          <ul class="step-list">
            <li
              v-for="(step, index) in stepList"
              :key="index"
              @click="toggleActive(index)"
              :class="['step-item', step.active && 'active']"
            >
              <span class="count">
                <svg-icon v-if="step.active" :icon-class="`plant_icon${index + 1}_active`"/>
                <svg-icon v-else :icon-class="`plant_icon${index + 1}`"/>
              </span>
              <span class="title">{{step.title}}</span>
            </li>
          </ul>
        </div>
        <div class="seperator-line"></div>
        <div class="steps-content">
          <el-form
            :model="plant"
            :rules="validRules"
            status-icon
            ref="plantForm"
            label-width="140px"
            @submit.native.prevent
            class="my-form"
          >
            <div v-show="activeIndex === 0" class="step-content-item">
              <div class="training-list-container">
                <ul class="training-list">
                  <li
                    v-for="(p1Plant, index) in plant.p1"
                    :key="index"
                    class="training-item"
                  >
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">养殖信息{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <span @click="deleteItemHandler(1, index)" class="delete-btn">
                          删除
                          <svg-icon icon-class="item_delete_icon"/>
                        </span>
                        <span
                          @click="expandHandler('p1', index)"
                          :class="['expand-btn', p1Plant.isExpanded && 'is-expanded']"
                        >
                          {{p1Plant.isExpanded ? '收起' : '展开'}}
                          <svg-icon icon-class="array_top"/>
                        </span>
                      </div>
                    </div>
                    <div v-if="p1Plant.isExpanded" class="training-item-content">
                      <el-col :span="12">
                        <el-form-item label="水产分类" :rules="requiredRules">
                          <el-select
                            :value="p1Plant.p1PlantType"
                            clearable
                            placeholder="请选择"
                            @change="p1PlantTypeChangeHandler($event, index)"
                            @input="inputHandler($event, `p1.${index}.p1PlantType`)"
                          >
                            <el-option
                              v-for="(item, index) in plantTypeOptions"
                              :key="index"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="品种" :rules="requiredRules">
                          <el-select
                            :value="p1Plant.p1SeedName"
                            clearable
                            placeholder="请选择"
                            @input="inputHandler($event, `p1.${index}.p1SeedName`, index)"
                          >
                            <el-option
                              v-for="(item, _index) in p1Plant.p1SeedNameOptions"
                              :key="_index + uniqId"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="水产批号">
                          <el-input
                            :value="p1Plant.p1SeedBatchNo"
                            @input="inputHandler($event, `p1.${index}.p1SeedBatchNo`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="育苗时间">
                          <el-date-picker
                            :value="p1Plant.dateRange"
                            type="daterange"
                            @input="inputHandler($event, `p1.${index}.dateRange`)"
                            value-format="timestamp"
                            :unlink-panels="true"
                            :picker-options="datePickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="水产名称" :rules="requiredRules">
                          <el-select
                            :value="p1Plant.p1PlantName"
                            clearable
                            placeholder="请选择"
                            @change="p1PlantNameChangeHandler($event, index)"
                            @input="inputHandler($event, `p1.${index}.p1PlantName`)"
                          >
                            <el-option
                              v-for="(item, _index) in p1Plant.p1PlantNameOptions"
                              :key="_index + uniqId"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="公司名称">
                          <el-input
                            :value="p1Plant.p1SeedCompanyName"
                            @input="inputHandler($event, `p1.${index}.p1SeedCompanyName`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="条数" :rules="countRules">
                          <el-input
                            :value="p1Plant.p1FishCount"
                            @input="inputHandler($event, `p1.${index}.p1FishCount`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item label="养殖时间" :rules="requiredRules">
                          <el-date-picker
                            :value="p1Plant.p1PlantDate"
                            type="date"
                            value-format="timestamp"
                            :picker-options="datePickerOptions"
                            @input="inputHandler($event, `p1.${index}.p1PlantDate`)"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
                <div class="add-btn-container">
                  <span @click="addItemHandler(1)" class="add-btn">
                    <svg-icon icon-class="add_plus"/>添加条目
                  </span>
                </div>
              </div>
            </div>
            <div v-show="activeIndex === 1" class="step-content-item">
              <div class="training-list-container">
                <ul class="training-list">
                  <li
                    v-for="(p2Plant, index) in plant.p2InputThing"
                    :key="index"
                    class="training-item"
                  >
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">投入品{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <span @click="deleteItemHandler(2, index)" class="delete-btn">
                          删除
                          <svg-icon icon-class="item_delete_icon"/>
                        </span>
                        <span
                          @click="expandHandler('p2InputThing', index)"
                          :class="['expand-btn', p2Plant.isExpanded && 'is-expanded']"
                        >
                          {{p2Plant.isExpanded ? '收起' : '展开'}}
                          <svg-icon icon-class="array_top"/>
                        </span>
                      </div>
                    </div>
                    <div v-if="p2Plant.isExpanded" class="training-item-content">
                      <el-col :span="12">
                        <el-form-item
                          label="投入品厂家"
                          :prop="`p2InputThing.${index}.factory`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p2Plant.factory"
                            @input="inputHandler($event, `p2InputThing.${index}.factory`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="投入量(公斤)"
                          :prop="`p2InputThing.${index}.amount`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p2Plant.amount"
                            @input="inputHandler($event, `p2InputThing.${index}.amount`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="投入品类型"
                          :prop="`p2InputThing.${index}.type`"
                          :rules="requiredRules"
                        >
                          <el-select
                            :value="p2Plant.type"
                            clearable
                            placeholder="请选择"
                            @change="p2InputThingTypeChangeHandler($event, index)"
                            @input="inputHandler($event, `p2InputThing.${index}.type`, index)"
                          >
                            <el-option
                              v-for="(item, _index) in p2TypeOptions"
                              :key="_index + uniqId"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          label="投入品生产批次"
                          :prop="`p2InputThing.${index}.batch`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p2Plant.batch"
                            @input="inputHandler($event, `p2InputThing.${index}.batch`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="投入时间"
                          :prop="`p2InputThing.${index}.date`"
                          :rules="requiredRules"
                        >
                          <el-date-picker
                            :value="p2Plant.date"
                            type="date"
                            value-format="timestamp"
                            :picker-options="datePickerOptions"
                            @input="inputHandler($event, `p2InputThing.${index}.date`)"
                          ></el-date-picker>
                        </el-form-item>
                        <el-form-item
                          v-if="p2Plant.type !== '其它'"
                          label="投入品分类"
                          :prop="`p2InputThing.${index}.class`"
                          :rules="requiredRules"
                        >
                          <el-select
                            :value="p2Plant.class"
                            clearable
                            placeholder="请选择"
                            @input="inputHandler($event, `p2InputThing.${index}.class`)"
                          >
                            <el-option
                              v-for="(item, _index) in p2Plant.classOptions"
                              :key="_index + uniqId"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
                <div class="add-btn-container">
                  <span @click="addItemHandler(2)" class="add-btn">
                    <svg-icon icon-class="add_plus"/>添加条目
                  </span>
                </div>
              </div>
            </div>
            <div v-show="activeIndex === 2" class="step-content-item">
              <div class="training-list-container">
                <ul class="training-list">
                  <li
                    v-for="(p3Plant, index) in plant.p3FieldManage"
                    :key="index"
                    class="training-item"
                  >
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">田间管理{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <span @click="deleteItemHandler(3, index)" class="delete-btn">
                          删除
                          <svg-icon icon-class="item_delete_icon"/>
                        </span>
                        <span
                          @click="expandHandler('p3FieldManage', index)"
                          :class="['expand-btn', p3Plant.isExpanded && 'is-expanded']"
                        >
                          {{p3Plant.isExpanded ? '收起' : '展开'}}
                          <svg-icon icon-class="array_top"/>
                        </span>
                      </div>
                    </div>
                    <div v-if="p3Plant.isExpanded" class="training-item-content">
                      <el-col :span="12">
                        <el-form-item
                          label="管理类型"
                          :prop="`p3FieldManage.${index}.type`"
                          :rules="requiredRules"
                        >
                          <el-select
                            :value="p3Plant.type"
                            clearable
                            placeholder="请选择"
                            @input="inputHandler($event, `p3FieldManage.${index}.type`)"
                          >
                            <el-option
                              v-for="(item, _index) in p3TypeOptions"
                              :key="_index + uniqId"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          label="管理时间"
                          :prop="`p3FieldManage.${index}.date`"
                          :rules="requiredRules"
                        >
                          <el-date-picker
                            :value="p3Plant.date"
                            type="date"
                            value-format="timestamp"
                            :picker-options="datePickerOptions"
                            @input="inputHandler($event, `p3FieldManage.${index}.date`)"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
                <div class="add-btn-container">
                  <span @click="addItemHandler(3)" class="add-btn">
                    <svg-icon icon-class="add_plus"/>添加条目
                  </span>
                </div>
              </div>
            </div>
            <div v-show="activeIndex === 3" class="step-content-item">
              <div class="training-list-container">
                <ul class="training-list">
                  <li
                    v-for="(p4Plant, index) in plant.p4HarvestManage"
                    :key="index"
                    class="training-item"
                  >
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">采收管理{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <span @click="deleteItemHandler(4, index)" class="delete-btn">
                          删除
                          <svg-icon icon-class="item_delete_icon"/>
                        </span>
                        <span
                          @click="expandHandler('p4HarvestManage', index)"
                          :class="['expand-btn', p4Plant.isExpanded && 'is-expanded']"
                        >
                          {{p4Plant.isExpanded ? '收起' : '展开'}}
                          <svg-icon icon-class="array_top"/>
                        </span>
                      </div>
                    </div>
                    <div v-if="p4Plant.isExpanded" class="training-item-content">
                      <el-col :span="12">
                        <el-form-item
                          label="采收面积(公顷)"
                          :prop="`p4HarvestManage.${index}.area`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p4Plant.area"
                            @input="inputHandler($event, `p4HarvestManage.${index}.area`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="采收产量(公斤)"
                          :prop="`p4HarvestManage.${index}.amount`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p4Plant.amount"
                            @input="inputHandler($event, `p4HarvestManage.${index}.amount`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="采收时间"
                          :prop="`p4HarvestManage.${index}.date`"
                          :rules="requiredRules"
                        >
                          <el-date-picker
                            :value="p4Plant.date"
                            type="date"
                            value-format="timestamp"
                            :picker-options="datePickerOptions"
                            @input="inputHandler($event, `p4HarvestManage.${index}.date`)"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          label="采收方式"
                          :prop="`p4HarvestManage.${index}.mode`"
                          :rules="requiredRules"
                        >
                          <el-select
                            :value="p4Plant.mode"
                            clearable
                            placeholder="请选择"
                            @input="inputHandler($event, `p4HarvestManage.${index}.mode`)"
                          >
                            <el-option
                              v-for="(item, _index) in p4TypeOptions"
                              :key="_index + uniqId"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          label="平均亩产(公斤)"
                          :prop="`p4HarvestManage.${index}.averageAmount`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p4Plant.averageAmount"
                            @input="inputHandler($event, `p4HarvestManage.${index}.averageAmount`)"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
                <div class="add-btn-container">
                  <span @click="addItemHandler(4)" class="add-btn">
                    <svg-icon icon-class="add_plus"/>添加条目
                  </span>
                </div>
              </div>
            </div>
            <div v-show="activeIndex === 4" class="step-content-item">
              <div class="training-list-container">
                <ul class="training-list">
                  <li
                    v-for="(p5Plant, index) in plant.p5ProcessManage"
                    :key="index"
                    class="training-item"
                  >
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">加工管理{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <span @click="deleteItemHandler(5, index)" class="delete-btn">
                          删除
                          <svg-icon icon-class="item_delete_icon"/>
                        </span>
                        <span
                          @click="expandHandler('p5ProcessManage', index)"
                          :class="['expand-btn', p5Plant.isExpanded && 'is-expanded']"
                        >
                          {{p5Plant.isExpanded ? '收起' : '展开'}}
                          <svg-icon icon-class="array_top"/>
                        </span>
                      </div>
                    </div>
                    <div v-if="p5Plant.isExpanded" class="training-item-content">
                      <el-col :span="12">
                        <el-form-item
                          label="加工方"
                          :prop="`p5ProcessManage.${index}.party`"
                          :rules="requiredRules"
                        >
                          <el-select
                            :value="p5Plant.party"
                            clearable
                            placeholder="请选择"
                            @input="inputHandler($event, `p5ProcessManage.${index}.party`)"
                          >
                            <el-option
                              v-for="(item, _index) in p5PartyOptions"
                              :key="_index + uniqId"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          v-if="p5Plant.party === '其他加工商'"
                          label="加工厂商证件号"
                          :prop="`p5ProcessManage.${index}.no`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p5Plant.no"
                            @input="inputHandler($event, `p5ProcessManage.${index}.no`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="加工时间"
                          :prop="`p5ProcessManage.${index}.date`"
                          :rules="requiredRules"
                        >
                          <el-date-picker
                            :value="p5Plant.date"
                            type="date"
                            value-format="timestamp"
                            :picker-options="datePickerOptions"
                            @input="inputHandler($event, `p5ProcessManage.${index}.date`)"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          v-if="p5Plant.party === '其他加工商'"
                          label="加工方名称"
                          :prop="`p5ProcessManage.${index}.name`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p5Plant.name"
                            @input="inputHandler($event, `p5ProcessManage.${index}.name`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="加工方批次"
                          :prop="`p5ProcessManage.${index}.batch`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p5Plant.batch"
                            @input="inputHandler($event, `p5ProcessManage.${index}.batch`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="加工量(公斤)"
                          :prop="`p5ProcessManage.${index}.amount`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p5Plant.amount"
                            type="number"
                            @input="inputHandler($event, `p5ProcessManage.${index}.amount`)"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
                <div class="add-btn-container">
                  <span @click="addItemHandler(5)" class="add-btn">
                    <svg-icon icon-class="add_plus"/>添加条目
                  </span>
                </div>
              </div>
            </div>
            <div v-show="activeIndex === 5" class="step-content-item">
              <div class="training-list-container">
                <ul class="training-list">
                  <li
                    v-for="(p6Plant, index) in plant.p6SaveManage"
                    :key="index"
                    class="training-item"
                  >
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">仓储类型{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <span @click="deleteItemHandler(6, index)" class="delete-btn">
                          删除
                          <svg-icon icon-class="item_delete_icon"/>
                        </span>
                        <span
                          @click="expandHandler('p6SaveManage', index)"
                          :class="['expand-btn', p6Plant.isExpanded && 'is-expanded']"
                        >
                          {{p6Plant.isExpanded ? '收起' : '展开'}}
                          <svg-icon icon-class="array_top"/>
                        </span>
                      </div>
                    </div>
                    <div v-show="p6Plant.isExpanded" class="training-item-content">
                      <el-col :span="12">
                        <el-form-item
                          label="仓储类型"
                          :prop="`p6SaveManage.${index}.type`"
                          :rules="requiredRules"
                        >
                          <el-select
                            :value="p6Plant.type"
                            clearable
                            placeholder="请选择"
                            @input="inputHandler($event, `p6SaveManage.${index}.type`)"
                          >
                            <el-option
                              v-for="(item, _index) in p6TypeOptions"
                              :key="_index + uniqId"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          label="仓储容量(公斤)"
                          :prop="`p6SaveManage.${index}.totalAmount`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p6Plant.totalAmount"
                            @input="inputHandler($event, `p6SaveManage.${index}.totalAmount`)"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          label="本次仓储量(公斤)"
                          :prop="`p6SaveManage.${index}.amount`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p6Plant.amount"
                            @input="inputHandler($event, `p6SaveManage.${index}.amount`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="入仓时间"
                          :prop="`p6SaveManage.${index}.date`"
                          :rules="requiredRules"
                        >
                          <el-date-picker
                            :value="p6Plant.date"
                            type="date"
                            value-format="timestamp"
                            :picker-options="datePickerOptions"
                            @input="inputHandler($event, `p6SaveManage.${index}.date`)"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item
                          label="仓库地址"
                          :prop="`p6SaveManage.${index}.address`"
                          :rules="requiredRules"
                        >
                          <p class="address">{{p6Plant.address}}</p>
                          <address-select ref="p6AddressSelect"></address-select>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
                <div class="add-btn-container">
                  <span @click="addItemHandler(6)" class="add-btn">
                    <svg-icon icon-class="add_plus"/>添加条目
                  </span>
                </div>
              </div>
            </div>
            <div v-show="activeIndex === 6" class="step-content-item">
              <div class="training-list-container">
                <ul class="training-list">
                  <li
                    v-for="(p7Plant, index) in plant.p7CheckManage"
                    :key="index"
                    class="training-item"
                  >
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">检测信息{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <span @click="deleteItemHandler(7, index)" class="delete-btn">
                          删除
                          <svg-icon icon-class="item_delete_icon"/>
                        </span>
                        <span
                          @click="expandHandler('p7CheckManage', index)"
                          :class="['expand-btn', p7Plant.isExpanded && 'is-expanded']"
                        >
                          {{p7Plant.isExpanded ? '收起' : '展开'}}
                          <svg-icon icon-class="array_top"/>
                        </span>
                      </div>
                    </div>
                    <div v-if="p7Plant.isExpanded" class="training-item-content">
                      <el-col :span="12">
                        <el-form-item
                          label="检测机构"
                          :prop="`p7CheckManage.${index}.org`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p7Plant.org"
                            @input="inputHandler($event, `p7CheckManage.${index}.org`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="送检人"
                          :prop="`p7CheckManage.${index}.user`">
                          <el-select
                            :value="p7Plant.user"
                            clearable
                            placeholder="请选择"
                            @input="inputHandler($event, `p7CheckManage.${index}.user`)"
                          >
                            <el-option
                              v-for="(item, _index) in p7UserOPtions"
                              :key="_index + uniqId"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
                          <span class="prompt-info-icon">
                            <svg-icon icon-class="info_i_1"></svg-icon>
                            <div class="prompt-info-dialog">
                              <p>数据来自【成员管理】中添加的经营人员或种植人员信息</p>
                            </div>
                        </span>
                        </el-form-item>
                        <el-form-item
                          label="检测员"
                          :prop="`p7CheckManage.${index}.tester`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p7Plant.tester"
                            @input="inputHandler($event, `p7CheckManage.${index}.tester`)"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          label="检测时间"
                          :prop="`p7CheckManage.${index}.date`"
                          :rules="requiredRules"
                        >
                          <el-date-picker
                            :value="p7Plant.date"
                            type="date"
                            value-format="timestamp"
                            :picker-options="datePickerOptions"
                            @input="inputHandler($event, `p7CheckManage.${index}.date`)"
                          ></el-date-picker>
                        </el-form-item>
                        <el-form-item
                          label="检测项目"
                          :prop="`p7CheckManage.${index}.project`"
                          :rules="requiredRules"
                        >
                          <el-select
                            :value="p7Plant.project"
                            clearable
                            placeholder="请选择"
                            @input="inputHandler($event, `p7CheckManage.${index}.project`)"
                          >
                            <el-option
                              v-for="(item, _index) in p7ProjectOptions"
                              :key="_index + uniqId"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
                          <div class="add-btn" @click="addCheckManage">新增</div>
                        </el-form-item>
                        <el-form-item
                          label="检测员电话"
                          :prop="`p7CheckManage.${index}.mobile`"
                          :rules="mobileRules"
                        >
                          <el-input
                            :value="p7Plant.mobile"
                            type="number"
                            @input="inputHandler($event, `p7CheckManage.${index}.mobile`)"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item
                          class="img-form-item"
                          label="检测报告"
                          :prop="`p7CheckManage.${index}.fileList`">
                          <file-carousel
                            v-if="p7Plant.fileList.length > 0"
                            :deleteFile="deleteFileHandler(index, 'p7CheckManage')"
                            :files="p7Plant.fileList"
                          ></file-carousel>
                          <uploader
                            v-if="p7Plant.fileList.length < 5"
                            :id="`p7FileUploader${index}`"
                            :uploadSuccessHandler="fileUploadHandler(index, 'p7CheckManage')"
                          ></uploader>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
                <div class="add-btn-container">
                  <span @click="addItemHandler(7)" class="add-btn">
                    <svg-icon icon-class="add_plus"/>添加条目
                  </span>
                </div>
              </div>
            </div>
            <div v-show="activeIndex === 7" class="step-content-item">
              <div class="training-list-container">
                <ul class="training-list">
                  <li
                    v-for="(p8Plant, index) in plant.p8DisasterInfo"
                    :key="index"
                    class="training-item"
                  >
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">受灾信息{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <span @click="deleteItemHandler(8, index)" class="delete-btn">
                          删除
                          <svg-icon icon-class="item_delete_icon"/>
                        </span>
                        <span
                          @click="expandHandler('p8DisasterInfo', index)"
                          :class="['expand-btn', p8Plant.isExpanded && 'is-expanded']"
                        >
                          {{p8Plant.isExpanded ? '收起' : '展开'}}
                          <svg-icon icon-class="array_top"/>
                        </span>
                      </div>
                    </div>
                    <div v-if="p8Plant.isExpanded" class="training-item-content">
                      <el-col :span="12">
                        <el-form-item
                          label="受灾类型"
                          :prop="`p8DisasterInfo.${index}.type`"
                          :rules="requiredRules"
                        >
                          <el-select
                            :value="p8Plant.type"
                            clearable
                            placeholder="请选择"
                            @input="inputHandler($event, `p8DisasterInfo.${index}.type`)"
                          >
                            <el-option
                              v-for="(item, _index) in p8TypeOptions"
                              :key="_index + uniqId"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          label="受灾面积(公顷)"
                          :prop="`p8DisasterInfo.${index}.area`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p8Plant.area"
                            @input="inputHandler($event, `p8DisasterInfo.${index}.area`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="预计损失(元)"
                          :prop="`p8DisasterInfo.${index}.lose`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p8Plant.lose"
                            @input="inputHandler($event, `p8DisasterInfo.${index}.lose`)"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          label="受灾时间"
                          :prop="`p8DisasterInfo.${index}.date`"
                          :rules="requiredRules"
                        >
                          <el-date-picker
                            :value="p8Plant.date"
                            type="date"
                            value-format="timestamp"
                            :picker-options="datePickerOptions"
                            @input="inputHandler($event, `p8DisasterInfo.${index}.date`)"
                          ></el-date-picker>
                        </el-form-item>
                        <el-form-item
                          label="预计减产(公斤)"
                          :prop="`p8DisasterInfo.${index}.reduce`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p8Plant.reduce"
                            @input="inputHandler($event, `p8DisasterInfo.${index}.reduce`)"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item
                          class="img-form-item"
                          label="受灾图片"
                          :prop="`p8DisasterInfo.${index}.fileList`"
                          :rules="requiredRules"
                        >
                          <file-carousel
                            v-if="p8Plant.fileList.length > 0"
                            :deleteFile="deleteFileHandler(index, 'p8DisasterInfo')"
                            :files="p8Plant.fileList"
                          ></file-carousel>
                          <uploader
                            v-if="p8Plant.fileList.length < 5"
                            :id="`p8FileUploader${index}`"
                            :uploadSuccessHandler="fileUploadHandler(index, 'p8DisasterInfo')"
                          ></uploader>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
                <div class="add-btn-container">
                  <span @click="addItemHandler(8)" class="add-btn">
                    <svg-icon icon-class="add_plus"/>添加条目
                  </span>
                </div>
              </div>
            </div>
            <div v-show="activeIndex === 8" class="step-content-item">
              <div class="training-list-container">
                <ul class="training-list">
                  <li
                    v-for="(p9Plant, index) in plant.p9MachineryUse"
                    :key="index"
                    class="training-item"
                  >
                    <div class="training-item-header">
                      <div class="left">
                        <span class="title">农机具使用{{index + 1}}</span>
                      </div>
                      <div class="right">
                        <span @click="deleteItemHandler(9, index)" class="delete-btn">
                          删除
                          <svg-icon icon-class="item_delete_icon"/>
                        </span>
                        <span
                          @click="expandHandler('p9MachineryUse', index)"
                          :class="['expand-btn', p9Plant.isExpanded && 'is-expanded']"
                        >
                          {{p9Plant.isExpanded ? '收起' : '展开'}}
                          <svg-icon icon-class="array_top"/>
                        </span>
                      </div>
                    </div>
                    <div v-if="p9Plant.isExpanded" class="training-item-content">
                      <el-col :span="12">
                        <el-form-item
                          label="农机具来源"
                          :prop="`p9MachineryUse.${index}.source`"
                          :rules="requiredRules"
                        >
                          <el-select
                            :value="p9Plant.source"
                            clearable
                            placeholder="请选择"
                            @input="inputHandler($event, `p9MachineryUse.${index}.source`)"
                          >
                            <el-option
                              v-for="(item) in p9SourceOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          v-if="p9Plant.source === '自有'"
                          label="农机具名称"
                          :prop="`p9MachineryUse.${index}.name`"
                          :rules="requiredRules"
                        >
                          <el-select
                            :value="p9Plant.name"
                            clearable
                            placeholder="请选择"
                            @input="inputHandler($event, `p9MachineryUse.${index}.name`)"
                          >
                            <el-option
                              v-for="(item, _index) in p9MachinerUseNameOptions"
                              :key="_index"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          v-else
                          label="农机具名称"
                          :prop="`p9MachineryUse.${index}.name`"
                          :rules="requiredRules"
                        >
                          <el-input
                            :value="p9Plant.name"
                            @input="inputHandler($event, `p9MachineryUse.${index}.name`)"
                          ></el-input>
                        </el-form-item>
                        <el-form-item
                          label="作业面积(公顷)"
                          :prop="`p9MachineryUse.${index}.area`"
                          :rules="areaRules"
                        >
                          <el-input
                            :value="p9Plant.area"
                            type="number"
                            @input="inputHandler($event, `p9MachineryUse.${index}.area`)"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          label="农机具类型"
                          :prop="`p9MachineryUse.${index}.type`"
                          :rules="requiredRules"
                        >
                          <el-select
                            :value="p9Plant.type"
                            clearable
                            placeholder="请选择"
                            @input="inputHandler($event, `p9MachineryUse.${index}.type`)"
                          >
                            <el-option
                              v-for="(item, _index) in farmMachineTypeOptions"
                              :key="_index + uniqId"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          label="使用时间"
                          :prop="`p9MachineryUse.${index}.date`"
                          :rules="requiredRules"
                        >
                          <el-date-picker
                            :value="p9Plant.date"
                            type="date"
                            value-format="timestamp"
                            :picker-options="datePickerOptions"
                            @input="inputHandler($event, `p9MachineryUse.${index}.date`)"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                    </div>
                  </li>
                </ul>
                <div class="add-btn-container">
                  <span @click="addItemHandler(9)" class="add-btn">
                    <svg-icon icon-class="add_plus"/>添加条目
                  </span>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="submitDisabled" class="enter-btn" @click="enterHandler">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import AddressSelect from "@/components/AddressSelect";
import FileCarousel from "@/components/FileCarousel";
import Uploader from "@/components/Uploader";
import constants from "@/util/constants";
import {inputFarmEditContent} from "@/util/asyncFun";
export default {
  name: "FishDialog",
  components: { AddressSelect, FileCarousel, Uploader },
  data() {
    return {
      submitDisabled: false,
      visible: false,
      farmLandId: "",
      farmLandCode: "",
      farmLandName: "",
      area: '',
      form: '',
      p7UserOPtions: [],
      p9SourceOptions: constants.P9_SOURCE_OPTIONS,
      p9MachinerUseNameOptions: [],
      stepList: _.cloneDeep(constants.FISH_STEP_LIST),
      validRules: {},
      requiredRules: { required: true, message: "该选项不能为空" },
      countRules: [
        { required: true, message: "该选项不能为空" },
        {
          pattern: /^[1-9]\d*$/,
          message: '鱼的条数只能为正整数'
        }
      ],
      areaRules: [
        {
          pattern: constants.REG_EXP.positiveInteger2,
          message: "输入的面积数值格式不对"
        }
      ],
      mobileRules: [
        { required: true, message: "该选项不能为空" },
        { pattern: constants.REG_EXP.phoneNum, message: "请输入正确的电话号码" }
      ],
      datePickerOptions: {
        disabledDate(date) {
          let year = new Date().getFullYear();
          let dateTimeOfFirstDay = new Date(`${year}-01-01 00:00:00`).getTime();
          let dateTimeOfLastDay = new Date(`${year}-12-31 23:59:59`).getTime();
          return !(
            date.getTime() >= dateTimeOfFirstDay &&
            date.getTime() <= dateTimeOfLastDay
          );
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      plant: "plant/currentPlant",
      dict: "dict/dict",
      dictList: "dict/dictList"
    }),
    // p1
    plantTypeOptions() {
      return this.dict.waterCultivation || [];
    },
    // p2
    p2TypeOptions() {
      return this.dict.fishCultivation || [];
    },
    // p3
    p3TypeOptions() {
      return this.dict.fisheryManage || [];
    },
    // p4
    p4TypeOptions() {
      return this.dict.harvestType || [];
    },
    // p5
    p5PartyOptions() {
      return this.dict.processingParty || [];
    },
    // p6
    p6TypeOptions() {
      return this.dict.storageType || [];
    },
    // p7
    p7ProjectOptions() {
      return this.dict.checkType || [];
    },
    // p8
    p8TypeOptions() {
      return this.dict.disasterType || [];
    },
    // p9
    farmMachineTypeOptions() {
      return this.dict.machineryType || [];
    },
    activeIndex() {
      let index = this.stepList.findIndex(item => item.active);
      return index;
    },
    nameOptions() {
      return constants.P1_NAME_OPTIONS[0].options;
    },
    uniqId() {
      return _.uniqueId("option_key");
    },
    title() {
      return `添加记录：${this.farmLandName}`;
    }
  },
  methods: {
    ...mapMutations({
      addP1: "plant/addP1",
      deleteP1ByIndex: "plant/deleteP1ByIndex",
      addP2: "plant/addP2",
      deleteP2ByIndex: "plant/deleteP2ByIndex",
      addP3: "plant/addP3",
      deleteP3ByIndex: "plant/deleteP3ByIndex",
      addP4: "plant/addP4",
      deleteP4ByIndex: "plant/deleteP4ByIndex",
      addP5: "plant/addP5",
      deleteP5ByIndex: "plant/deleteP5ByIndex",
      addP6: "plant/addP6",
      deleteP6ByIndex: "plant/deleteP6ByIndex",
      addP7: "plant/addP7",
      deleteP7ByIndex: "plant/deleteP7ByIndex",
      addP8: "plant/addP8",
      deleteP8ByIndex: "plant/deleteP8ByIndex",
      addP9: "plant/addP9",
      deleteP9ByIndex: "plant/deleteP9ByIndex",
      resetCurrentPlant: "plant/resetCurrentPlant",
      updateCurrentPlant: "plant/updateCurrentPlant",
      updateExpandedByKeyIndex: "plant/updateExpandedByKeyIndex"
    }),
    ...mapActions({
      createPlant: "plant/createPlant",
      getPlantHistory: "plant/getPlantHistory",
      getLandList: "land/getLandList",
      getAllDictList: 'dict/getAllDictList'
    }),
    show({ name, code, id, area, form}) {
      this.visible = true;
      this.farmLandName = name;
      this.farmLandId = id;
      this.farmLandCode = code;
      this.area = area;
      this.form = form;
      console.log(this.stepList);
    },
    hide() {
      this.visible = false;
      this.farmLandName = "";
      this.farmLandId = "";
      this.area = '';
      this.p7UserOPtions = [];
      this.p9MachinerUseNameOptions = [];
    },
    inputHandler(value, key, index) {
      this.updateCurrentPlant({ key, value, index });
    },
    // 农场主角色 填写更新内容 wangshuo
    editContent(value) {
      this.updateCurrentPlant({key: 'updateInfo', value})
    },
    async getMemberList() {
      try {
        let { id } = this.$route.params;
        let res1 = await this.$service.getPlantMemberList({ farmId: id });
        let res2 = await this.$service.getManageMemberList({ farmId: id });
        let res3 = await this.$service.getFarmMachineList({ farmId: id });

        if (res1 && res1.code === 0) {
          this.p7UserOPtions = _.concat(this.p7UserOPtions, res1.data.list);
        }
        if (res2 && res2.code === 0) {
          this.p7UserOPtions = _.concat(this.p7UserOPtions, res2.data.list);
        }
        if (res3 && res3.code === 0) {
          this.p9MachinerUseNameOptions = res3.data.list;
        }
      } catch (err) {
        console.log(err);
      }
    },
    expandHandler(key, index) {
      this.updateExpandedByKeyIndex({ key, index });
    },
    async openDialogHandler() {
      try {
        this.submitDisabled = false;
        await this.$nextTick();
        let year = new Date().getFullYear();
        this.stepList = _.cloneDeep(constants.FISH_STEP_LIST);
        await this.getPlantHistory({ farmLandId: this.farmLandId, year: year });
        this.updateCurrentPlant({ key: "farmLandId", value: this.farmLandId });
        this.updateCurrentPlant({
          key: "farmLandCode",
          value: this.farmLandCode
        });
        this.updateCurrentPlant({ key: "area", value: this.area });
        // 获取送检人
        this.getMemberList();

        this.$refs.plantForm.clearValidate();
      } catch (err) {
        console.log(err);
      }
    },
    beforeCloseHandler() {
      this.cancelHandler();
    },
    async cancelHandler() {
      let error = this.checkPlantData(); // 数据校验提示
      if (error.length > 0) {
        let message = `${error.join(", ")} 需要补全内容`;
        let confirm = await this.$confirm(
          `${message}, 您确定要关闭吗, 是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "error"
          }
        );
        if (confirm) {
          this.hide();
          this.resetCurrentPlant();
        }
      } else {
        this.hide();
        this.resetCurrentPlant();
      }
    },
    async enterHandler() {
      try {
        this.setP6ListAddress(); // 设置仓储管理的地址
        let error = this.checkPlantData(); // 数据校验提示
        if (error.length > 0) {
          this.$message.error(`${error.join(", ")} 需要补全内容`);
          return false;
        }
        let valid = await this.$refs.plantForm.validate();
        if (valid) {
          let { id } = this.$route.params;
          this.submitDisabled = true;
          // 农场主权限 需要填写更新内容 wangshuo
          if(this.$wsCache.localStorage.get('login').roleType === 'FARM_EMPLOYEE' || this.$wsCache.localStorage.get('login').roleType === 'FARM_OWNER') {
            let isEdit = await inputFarmEditContent(this.editContent);
            if(!isEdit) {
              this.submitDisabled = false;
              return;
            }
          }
          if (id) {
            this.updateCurrentPlant({ key: "form", value: this.form });
            this.updateCurrentPlant({ key: "landName", value: name });
            // this.updateCurrentPlant({key: 'farmId', value: id}); // 设置农场ID
            let res = await this.createPlant(id);
            if (res && res.code === 0) {
              await this.getLandList(id);
              this.cancelHandler();
            } else {
              this.submitDisabled = false;
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    toggleActive(active) {
      this.stepList = this.stepList.map((item, index) => {
        if (index === active) {
          item.active = true;
        } else {
          item.active = false;
        }
        return item;
      });
    },
    setP6ListAddress() {
      let p6SaveManage = this.plant.p6SaveManage.map((item, index) => {
        let { address, areaCode } = _.get(this.$refs, `p6AddressSelect.${index}`).getAddress();
        if (address || areaCode) {
          if (_.get(item, "address") !== address) {
            item.address = address;
          }
        }
        return item;
      });
      this.updateCurrentPlant({ key: "p6SaveManage", value: p6SaveManage });
    },
    deleteFileHandler(index, prop) {
      return _index => {
        let url = _.get(this.plant, `${prop}.${index}.fileList`);
        let urlList = url.filter((item, __index) => _index !== __index);
        this.updateCurrentPlant({
          key: `${prop}.${index}.fileList`,
          value: urlList
        });
      };
    },
    fileUploadHandler(index, prop) {
      return data => {
        let fileList = _.get(this.plant, `${prop}.${index}.fileList`);
        let urlList = _.chain(fileList)
          .concat(data)
          .uniqBy("fileUrl")
          .value();
        this.updateCurrentPlant({
          key: `${prop}.${index}.fileList`,
          value: urlList
        });
      };
    },
    addItemHandler(item) {
      switch (item) {
        case 1:
          this.addP1(this.dictList);
          break;
        case 2:
          this.addP2(this.dictList);
          break;
        case 3:
          this.addP3(this.dictList);
          break;
        case 4:
          this.addP4(this.dictList);
          break;
        case 5:
          this.addP5(this.dictList);
          break;
        case 6:
          this.addP6(this.dictList);
          break;
        case 7:
          this.addP7(this.dictList);
          break;
        case 8:
          this.addP8(this.dictList);
          break;
        case 9:
          this.addP9(this.dictList);
          break;
        default:
          throw new Error("无效索引");
      }
    },
    deleteItemHandler(item, index) {
      switch (item) {
        case 1:
          this.deleteP1ByIndex({ index });
          break;
        case 2:
          this.deleteP2ByIndex({ index });
          break;
        case 3:
          this.deleteP3ByIndex({ index });
          break;
        case 4:
          this.deleteP4ByIndex({ index });
          break;
        case 5:
          this.deleteP5ByIndex({ index });
          break;
        case 6:
          this.deleteP6ByIndex({ index });
          break;
        case 7:
          this.deleteP7ByIndex({ index });
          break;
        case 8:
          this.deleteP8ByIndex({ index });
          break;
        case 9:
          this.deleteP9ByIndex({ index });
          break;
        default:
          throw new Error("无效索引");
      }
    },
    async addCheckManage() {
      try {
        let prompt = await this.$prompt(`请输入新检测项目`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\S/,
          inputValidator: value => {
            if (value.length > 20) {
              return `新检测项目不能超过20个字符`;
            }

            let index = this.p7ProjectOptions.findIndex(
              item => item.name === value
            );
            if (index >= 0) {
              return `新标签${value}已经存在`;
            } else {
              return true;
            }
          },
          inputErrorMessage: `标签不能为空`
        });
        if (prompt.action === "confirm") {
          let mark = {
            description: prompt.value,
            keyType: _.get(this.p7ProjectOptions, "0.keyType"),
            name: prompt.value,
            value: _.get(this.p7ProjectOptions, "0.value")
          };
          let res = await this.$service.postDict(mark);
          if (res && res.code === 0) {
            this.getAllDictList();
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    p2InputThingTypeChangeHandler(value, index) {
      let p2Type = this.p2TypeOptions.find(item => item.name === value);
      let options = this.dictList.filter(
        item => parseInt(item.parentId) === _.get(p2Type, "id")
      );
      this.updateCurrentPlant({
        key: `p2InputThing.${index}.classOptions`,
        value: options
      });
    },
    isEmpty(value) {
      return _.isNull(value) || _.isUndefined(value) || value === '';
    },
    // 新的修改
    p1PlantTypeChangeHandler(value, index) {
      let p1PlantType = this.plantTypeOptions.find(item => item.name === value);
      let options = this.dictList.filter(
        item => parseInt(item.parentId) === _.get(p1PlantType, "id")
      );
      // 先清除字段的值
      this.updateCurrentPlant({
        key: `p1.${index}.p1SeedName`,
        value: ''
      });
      this.updateCurrentPlant({
        key: `p1.${index}.p1PlantName`,
        value: ''
      });
      // 再清除下拉选项
      this.updateCurrentPlant({
        key: `p1.${index}.p1PlantNameOptions`,
        value: options
      });
      this.updateCurrentPlant({
        key: `p1.${index}.p1SeedNameOptions`,
        value: []
      });
    },
    p1PlantNameChangeHandler(value, index) {
      let plantNameOptions = _.get(this.plant, `p1.${index}.p1PlantNameOptions`);
      let plantName = plantNameOptions.find(item => item.name === value);
      let options = this.dictList.filter(
        item => parseInt(item.parentId) === _.get(plantName, "id")
      );
      // 先清除字段的值
      this.updateCurrentPlant({
        key: `p1.${index}.p1SeedName`,
        value: ''
      });
      this.updateCurrentPlant({
        key: `p1.${index}.p1SeedNameOptions`,
        value: options
      });
    },
    checkPlantData() {
      let {
        p1,
        p2InputThing,
        p3FieldManage,
        p4HarvestManage,
        p5ProcessManage,
        p6SaveManage,
        p7CheckManage,
        p8DisasterInfo,
        p9MachineryUse
      } = this.plant;
      let error = [];
      for (let i = 0; i < p1.length; i++) {
        let p1Keys = _.chain(p1[i])
                      .pick(['p1PlantType', 'p1PlantName', 'p1SeedName', 'p1PlantDate'])
                      .keys()
                      .value();
        for (let j = 0; j < p1Keys.length; j++) {
          if (this.isEmpty(_.get(p1[i], `${p1Keys[j]}`))) {
            error.push(`水产信息`);
            break;
          }
        }
      }
      // p2
      for (let i = 0; i < p2InputThing.length; i++) {
        let p2Keys = Object.keys(p2InputThing[i]);
        if (_.get(p2InputThing[i], "type") === "其它") {
          p2Keys = p2Keys.filter(item => item !== "class");
        }
        for (let j = 0; j < p2Keys.length; j++) {
          if (this.isEmpty(_.get(p2InputThing[i], `${p2Keys[j]}`))) {
            error.push(`投入品`);
            break;
          }
        }
      }
      // p3
      for (let i = 0; i < p3FieldManage.length; i++) {
        let p3Keys = Object.keys(p3FieldManage[i]);
        for (let j = 0; j < p3Keys.length; j++) {
          if (this.isEmpty(_.get(p3FieldManage[i], `${p3Keys[j]}`))) {
            error.push(`田间管理`);
            break;
          }
        }
      }
      // p4
      for (let i = 0; i < p4HarvestManage.length; i++) {
        let p4Keys = Object.keys(p4HarvestManage[i]);
        for (let j = 0; j < p4Keys.length; j++) {
          if (this.isEmpty(_.get(p4HarvestManage[i], `${p4Keys[j]}`))) {
            error.push(`采收管理`);
            break;
          }
        }
      }
      // p5
      for (let i = 0; i < p5ProcessManage.length; i++) {
        let p5Keys = Object.keys(p5ProcessManage[i]);
        if (_.get(p5ProcessManage[i], "party") === "自营") {
          p5Keys = p5Keys.filter(item => item !== "name" && item !== "no");
        }
        for (let j = 0; j < p5Keys.length; j++) {
          if (this.isEmpty(_.get(p5ProcessManage[i], `${p5Keys[j]}`))) {
            error.push(`加工管理`);
            break;
          }
        }
      }
      // p6
      for (let i = 0; i < p6SaveManage.length; i++) {
        let p6Keys = Object.keys(p6SaveManage[i]);
        for (let j = 0; j < p6Keys.length; j++) {
          if (this.isEmpty(_.get(p6SaveManage[i], `${p6Keys[j]}`))) {
            console.log(_.get(p6SaveManage[i], `${p6Keys[j]}`));
            error.push(`仓储管理`);
            break;
          }
        }
      }
      // p7
      for (let i = 0; i < p7CheckManage.length; i++) {
        let p7Keys = Object.keys(p7CheckManage[i]).filter((item) => {
          return item !== 'user' && item !== 'fileList';
        });
        for (let j = 0; j < p7Keys.length; j++) {
          if (this.isEmpty(_.get(p7CheckManage[i], `${p7Keys[j]}`))) {
            error.push(`检测信息`);
            break;
          }
        }
      }
      // p8
      for (let i = 0; i < p8DisasterInfo.length; i++) {
        let p8Keys = Object.keys(p8DisasterInfo[i]);
        for (let j = 0; j < p8Keys.length; j++) {
          if (this.isEmpty(_.get(p8DisasterInfo[i], `${p8Keys[j]}`))) {
            error.push(`受灾信息`);
            break;
          }
        }
      }
      // p9
      for (let i = 0; i < p9MachineryUse.length; i++) {
        let p9Keys = Object.keys(p9MachineryUse[i]).filter(
          item => item !== "area"
        );
        for (let j = 0; j < p9Keys.length; j++) {
          if (this.isEmpty(_.get(p9MachineryUse[i], `${p9Keys[j]}`))) {
            error.push(`农机具使用`);
            break;
          }
        }
      }

      return error;
    }
  }
};
</script>
<style lang="scss" scoped>
.plant-protection-detail-container {
  .steps {
    width: 100%;
    margin-top: 50px;
    margin-bottom: 30px;
    .step-list {
      display: flex;
      .step-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        font-weight: 400;
        cursor: pointer;
        .count {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-bottom: 10px;
          .svg-icon {
            width: 50px;
            height: 50px;
          }
        }
        .title {
          font-size: 14px;
          color: #a8abb3;
        }
        &.active {
          .title {
            color: #f0f0f0;
          }
        }
      }
    }
  }
  .steps-content {
    margin-top: 50px;
  }

}
</style>
