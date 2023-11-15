declare namespace kintone.types {
  interface outFields {
    detail: kintone.fieldTypes.MultiLineText;
    id: kintone.fieldTypes.SingleLineText;
    tittle: kintone.fieldTypes.SingleLineText;
  }
  interface outterAppSavedFields extends outFields {
    $id: kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    更新人: kintone.fieldTypes.Modifier;
    创建人: kintone.fieldTypes.Creator;
    记录编号: kintone.fieldTypes.RecordNumber;
    创建时间: kintone.fieldTypes.CreatedTime;
    更新时间: kintone.fieldTypes.UpdatedTime;
  }
}
