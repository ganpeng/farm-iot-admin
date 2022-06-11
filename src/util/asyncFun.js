import { MessageBox } from "element-ui";
import service from '@/service';
async function inputFarmEditContent(callback) {
  try {
    let prompt = await MessageBox.prompt("请填写更新内容", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPlaceholder: "请填写更新内容（200字以内）",
      inputValidator: value => {
        if(!value) {
          return `更新内容不能为空`;
        }
        if(value.trim().length === 0) {
          return `更新内容不能为空`
        }
        if (value.length > 200) {
          return `更新内容不能超过200个字`;
        }
      }
    });
    if (prompt.action === "confirm") {
      callback(prompt.value);
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}
// 通过审核
async function passEdit(id, callback) {
  try {
    // TODO 这个权限判断？
    // if (!this.$authority.isHasAuthority('admin:farm:delete')) {
    //   return;
    // }
    let confirm = await MessageBox.confirm(
      "确定通过此次修改内容？通过后不可撤销，请谨慎操作。",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );
    if (confirm) {
      let params = {
        id,
        approveStatus: "APPROVED",
        reasonDesc: ""
      };
      let res = await service.farmOperate(params);
      if (res && res.code === 0) {
        callback && callback();
        return true;
      }
      return false;
    }
    return false;
  } catch (err) {
    console.log(err);
  }
}
// 拒绝审核
async function rejectEdit(id, callback) {
  try {
    // TODO 这个权限判断？
    // if (!this.$authority.isHasAuthority('admin:farm:delete')) {
    //   return;
    // }
    let prompt = await MessageBox.prompt("请填写拒绝原因", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPlaceholder: "请输入拒绝原因（100字以内）",
      inputValidator: value => {
        if(!value) {
          return `拒绝原因不能为空`;
        }
        if (value.trim().length === 0) {
          return `拒绝原因不能为空`;
        }
        if (value.length > 100) {
          return `拒绝原因不能超过100个字`;
        }
      }
    });
    if (prompt.action === "confirm") {
      let params = {
        id,
        approveStatus: "REJECT",
        reasonDesc: prompt.value
      };
      let res = await service.farmOperate(params);
      if (res && res.code === 0) {
        callback && callback();
        return true;
      }
      return false;
    }
    return false;
  } catch (err) {
    console.log(err);
  }
}

export { inputFarmEditContent, passEdit, rejectEdit };
