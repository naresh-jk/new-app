excelToArray(evt){
            var _this = this;
            var fileUploadEl = document.getElementById("bulkQuestionUpload");
            var fileSize = fileUploadEl.files.item(0).size;
            var fileName = fileUploadEl.files.item(0).name;
            var fileExt = fileName.split('.')[1];
            if(fileExt.toUpperCase() != 'XLSX'){
                fileUploadEl.value = "";
                //this.errorMsgs = 'Please select "XLSX" only';
                return 'Please select "XLSX" only';
            } else if(parseFloat(fileSize / 1048576) > 2){
                //this.errorMsgs = 'File size should be less than 2MB';
                return 'File size should be less than 2MB';
            }
            var reader = new FileReader();
            _this.excelData = [];
            let colRange = (_this.dataObj.typeOfQuestions != 'mcq') ? 0 : 6;
            reader.addEventListener("loadend", (evt) => {
                _this.ajaxLoading = true;
                var workbook = XLSX.read(evt.target.result, {type: "binary"}),
                    worksheet = workbook.Sheets[workbook.SheetNames[0]],
                    range = XLSX.utils.decode_range(worksheet["!ref"]);
                    range.s.r = 1;
                for (let row=range.s.r; row<=range.e.r; row++) {
                    let i = _this.excelData.length;
                    _this.excelData.push([]);
                    for (let col=range.s.c; col<=colRange; col++) { //range.e.c
                        let cell = worksheet[XLSX.utils.encode_cell({r:row, c:col})];
                        let cellVal = '';
                        if(cell && cell.v.toString()){  
                            cellVal = cell.v;
                            if( typeof(cell.v) == 'string' ){
                                cellVal = cell.v.replace(/"/g, '&quot;');
                            }else if( typeof(cell.v) == 'number' || typeof(cell.v) == 'boolean' ){
                                cellVal = cell.v;
                            }
                        }
                        _this.excelData[i].push(cellVal);
                    }
                }
                _this.ajaxLoading = false;
            });
            reader.readAsArrayBuffer(evt.target.files[0]);
            this.dataObj.selectedFileName = fileName;
        },
                    
        // scroll to error field - need to insert 'required' as a class
                    
          scrollToErr(){
                    setTimeout(() => {
                        let scrollTo = document.querySelector('.required').offsetTop - 202;
                        window.scroll({ top: scrollTo, behavior: 'smooth' });
                    }, 100);
                },
