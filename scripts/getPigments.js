        const tableName = 'Pigments';
        const viewName = 'Pigment list';

        async function getPigments() {
            const url = `https://api.airtable.com/v0/${baseId}/${tableName}?view=${viewName}&offset=${offset}`;
            try {
                const response = await fetch(url, {
                    headers: {
                        Authorization: apiKey
                    }
                });
                const data = await response.json();
                const records = data.records.map(record => {
                    const fields = record.fields;
                    const mappedData = {
                        id: record.id,
                        pigmentCode: fields['Code'],
                        pigmentName: fields['Name'],
                        description: fields['Pigment description'],
                        colorCategory: fields['Color category'],
                        toxicicity: fields['Toxicicity'],
                        toxicicityNote: fields['Toxicity note'],
                        opacity: fields.Transparency,
                        swatchImage: fields.Swatch[0].url,
                        usedIn: fields['Used in'],
                        usedInMaterial: fields['Used in Material'],
                    };
                    return mappedData;
                });
                allRecords = allRecords.concat(records);
                // allRecords = allRecords.concat(records).sort((a, b) => (a.colorCategory + a.pigmentCode > b.colorCategory + b.pigmentCode) ? 1 : ((b.colorCategory + b.pigmentCode > a.colorCategory + a.pigmentCode) ? -1 : 0));
                if (data.offset) {
                    offset = data.offset;
                    await getPigments();
                } else {
                    for (var i = 0; i < allRecords.length; i++) {

                        document.querySelector("#swatch-list").innerHTML += `
                        <div class="swatch-card">
                            <img src=${allRecords[i].swatchImage} alt="" class="pigment-image">
                                <div class="card-text">
                                    <div class="pigment-card-text-column">
                                        <h2 class="color-name">${allRecords[i].pigmentName || ''}</h2>
                                        <p class="color-number">${allRecords[i].pigmentCode || ''}</p>
                                    </div>
                                    <div class="color-information-list">
                                        <div class="color-information-item" id="opacity">
                                            <i class="color-information-icon pigment-opacity ${allRecords[i].opacity || ''}"></i>
                                            <p class="color-information-tag">${allRecords[i].opacity || ''}</p>
                                        </div>
                                        <div class="color-information-item" id="toxicicity">
                                            <i class="color-information-icon ${allRecords[i].toxicicity.slice(0,1).toLowerCase() || ''}"></i>
                                            <p class="color-information-tag">${allRecords[i].toxicicity || ''}</p>
                                        </div>
                                    </div>
                                </div>
                        </div>`;
                    }
                }
            } catch (error) {

            }
        }
        getPigments()
