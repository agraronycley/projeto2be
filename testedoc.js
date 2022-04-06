/**
 * 
 * @description Altera para true a propriedade 'Herda a segurança do pai' dos arquivos contifos numa hierarquia de pastas
 * @author Ronycley Agra
 * @since 06/04/2022
 */

function createDataset(fields, constraints, sortFields) {
    
	//Deve-se passar como parametro o id da da pasta que está no topo da hieraraquia, no caso o ID a pasta 'Documentos de Fornecedores e Clientes'
    getDocuments(4016658);
    
    return DatasetBuilder.newDataset();

}

function getDocuments(folderId){
	
	// Tipo do documento que define ser uma pasta
    var DOCUMENT_TYPE_FOLDER = "1";

    // Tipo do documento que define ser um documento normal
    var DOCUMENT_TYPE_NORMAL = "2";
    
    var documents = fluigAPI.getFolderDocumentService().list(folderId),
    iterator = documents.iterator();

    while (iterator.hasNext()) {
        var document = iterator.next();

        if (document.getDeleted() == "true") {
            continue;
        }

        var documentType = document.getDocumentType();

        if (documentType == DOCUMENT_TYPE_FOLDER) {
            getDocuments(document.getDocumentId());
            continue;
        }

        if (documentType == DOCUMENT_TYPE_NORMAL) {
        	       
            var docDto = docAPI.newDocumentDto();
		    var attachArray = new java.util.ArrayList();
		    var mainAttach = docAPI.newAttachment();

		    var documentoOrigem = docAPI.copyDocumentToUploadArea(document.getDocumentId(), document.getVersion())[0];
		  
		    docDto.setDocumentId(0);
		    docDto.setDocumentTypeId("");
		    docDto.setDocumentDescription(documentoOrigem);
		    docDto.setParentDocumentId(folderId);
		    docDto.setInheritSecurity(true);

		    mainAttach.setFileName(documentoOrigem);
		    mainAttach.setPrincipal(true);
		    mainAttach.setAttach(false);
		    attachArray.add(mainAttach);

		    docAPI.createDocument(docDto, attachArray, null, null, null);

		    fluigAPI.getDocumentService().deleteDocument(document.getDocumentId());
        }
        
    }

}