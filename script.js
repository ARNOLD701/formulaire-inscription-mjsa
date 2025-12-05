document.addEventListener('DOMContentLoaded', function() {
            // Initialisation - masquer le document au chargement
            const documentContainer = document.querySelector('.document-wrapper');
            documentContainer.style.display = 'none';
            
            // Gestion de la prévisualisation de la photo
            const childPhotoInput = document.getElementById('childPhoto');
            const childPhotoPreview = document.getElementById('childPhotoPreview');
            
            childPhotoInput.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    if (file.size>5*1024*1024) {
                        alert('Pour une meilleure qualité dans le pdf, utilisez une image de 5MB.');
                    }

                    const reader = new FileReader();
                    reader.onload = function(e) {
                        childPhotoPreview.innerHTML = `<img src="${e.target.result}" alt="Photo de l'enfant" style="image-rendering: crisp-edges;>`;
                    }
                    reader.readAsDataURL(file);
                } else {
                    childPhotoPreview.innerHTML = '<span>Aucune photo sélectionnée</span>';
                }
            });
            
            // Génération du document
            const generateBtn = document.getElementById('generateBtn');
            const successMessage = document.getElementById('successMessage');
            
            generateBtn.addEventListener('click', function() {
                // Récupération des valeurs du formulaire
                const childFirstName = document.getElementById('childFirstName').value;
                const childLastName = document.getElementById('childLastName').value;
                const childBirthDate = document.getElementById('childBirthDate').value;
                const childBirthPlace = document.getElementById('childBirthPlace').value;
                const childAddress = document.getElementById('childAddress').value;
                const childCategorie = document.getElementById('childCategorie').value;
                const childYear = document.getElementById('childYear').value;

                
                const motherFirstName = document.getElementById('motherFirstName').value;
                const motherLastName = document.getElementById('motherLastName').value;
                const motherBirthDate = document.getElementById('motherBirthDate').value;
                const motherBirthPlace = document.getElementById('motherBirthPlace').value;
                const motherAddress = document.getElementById('motherAddress').value;
                const motherNumber = document.getElementById('motherNumber').value;
                
                const fatherFirstName = document.getElementById('fatherFirstName').value;
                const fatherLastName = document.getElementById('fatherLastName').value;
                const fatherBirthDate = document.getElementById('fatherBirthDate').value;
                const fatherBirthPlace = document.getElementById('fatherBirthPlace').value;
                const fatherAddress = document.getElementById('fatherAddress').value;
                const fatherNumber = document.getElementById('fatherNumber').value;
                
                // Validation basique
                if (!childFirstName || !childLastName || !motherFirstName || !motherLastName || !fatherFirstName || !fatherLastName) {
                    alert('Veuillez remplir au moins les noms et prénoms de l\'enfant, de la mère et du père.');
                    return;
                }
                
                // Mise à jour du document
                document.getElementById('docChildName').textContent = `${childFirstName} ${childLastName}`;
                document.getElementById('docChildBirthDate').textContent = formatDate(childBirthDate);
                document.getElementById('docChildBirthPlace').textContent = childBirthPlace;
                document.getElementById('docChildAddress').textContent = childAddress;
                document.getElementById('docChildCategorie').textContent = childCategorie;
                document.getElementById('docChildYear').textContent = formatNumber(childYear);

                
                document.getElementById('docMotherName').textContent = `${motherFirstName} ${motherLastName}`;
                document.getElementById('docMotherBirthDate').textContent = formatDate(motherBirthDate);
                document.getElementById('docMotherBirthPlace').textContent = motherBirthPlace;
                document.getElementById('docMotherAddress').textContent = motherAddress;
                document.getElementById('docMotherNumber').textContent = FormatPhoneNumber(motherNumber);
                
                document.getElementById('docFatherName').textContent = `${fatherFirstName} ${fatherLastName}`;
                document.getElementById('docFatherBirthDate').textContent = formatDate(fatherBirthDate);
                document.getElementById('docFatherBirthPlace').textContent = fatherBirthPlace;
                document.getElementById('docFatherAddress').textContent = fatherAddress;
                document.getElementById('docFatherNumber').textContent = FormatPhoneNumber(fatherNumber);
                
                // Date de génération du document
                document.getElementById('documentDate').textContent = new Date().toLocaleDateString('fr-FR');
                
                // Gestion de la photo
                const docChildPhoto = document.getElementById('docChildPhoto');
                if (childPhotoInput.files && childPhotoInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        docChildPhoto.innerHTML = `<img src="${e.target.result}" alt="Photo de l'enfant"> style="image-rendering: crisp-edges; width: 100%; height: 100%;object-fit: cover;"`;
                    }
                    reader.readAsDataURL(childPhotoInput.files[0]);
                } else {
                    docChildPhoto.innerHTML = '<span>Aucune photo disponible</span>';
                }
                
                // Affichage du document avec animation
                documentContainer.style.display = 'block';
                documentContainer.classList.add('fade-in');
                
                // Afficher le message de succès
                successMessage.style.display = 'block';
                
                // Défilement vers le document
                documentContainer.scrollIntoView({ behavior: 'smooth' });
            });
            
            //Fonction pour numéro de téléphone
            function FormatPhoneNumber(phone){
                if(!phone) return 'Non renseigné';
                
                //Supprimer les caractères non numériques
                const cleaned = phone.toString().replace(/\D/g, '');

                //Formater selon la longueur
                if(cleaned.length === 10) {
                    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
                }

                return phone;
            }
            //Fonction pour les nombres
            function formatNumber(number){
                if(!number && number !== 0) return 'Non renseigné';
                return new Intl.NumberFormat('fr-FR').format(number);
            }

            // Fonction pour formater la date
            function formatDate(dateString) {
                if (!dateString) return '';
                const date = new Date(dateString);
                return date.toLocaleDateString('fr-FR');
            }
            
            // Gestion du téléchargement PDF
            const downloadPdfBtn = document.getElementById('downloadPdfBtn');
            const loadingIndicator = document.getElementById('loadingIndicator');
            
            downloadPdfBtn.addEventListener('click', function() {
                // Afficher l'indicateur de chargement
                loadingIndicator.style.display = 'block';
                
                //Sauvegarder la transformation actuelle
                const documentConst = document.getElementById('documentContainer');
                const originalScale = documentContainer.style.transform;

                //Rétablir la taille originale pour la capture haute résolution
                documentContainer.style.transform = 'scale(1)';
                documentConst.style.boxShadow = 'none';

                // Utiliser html2canvas pour capturer le document
                setTimeout(() => {
                html2canvas(documentConst, {
                    scale: 3, // Augmenter la qualité
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#FFFFFF',
                    allowTaint: true,
                    //paramètrage pour améliorer la qualité
                    windowWidth: documentConst.scrollWidth,
                    windowHeight: documentConst.scrollHeight,
                    //Ignorer les éléments la classe no-print
                    ignoreElements: function(element){
                        return element.classList.contains('no-print');
                    },
                    //optimisation de la qualité
                    onclone: function(cloneDoc) {
                        const clonedConst = cloneDoc.getElementById('documentContainer');
                        if(clonedConst){
                            clonedConst.style.boxShadow= 'none';

                            const images= clonedConst.getElementByTagName('img');
                            for(let img of images){
                                img.style.imageRendering ='crisp-edges';
                                img.style.webkitFontSmoothing = 'antialiased';
                            }

                            clonedConst.style.webkitFontSmoothing = 'antialiased';
                            clonedConst.style.mozOsxFontSmoothing = 'grayscale';
                        }
                    }    
                }).then(canvas => {
                    documentContainer.style.transform = originalScale;
                    documentConst.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';

                    const optimizedCanvas = optimizeCanvasQuality(canvas);

                    const imgData = canvas.toDataURL('image/jpeg', 0.95);
                    
                    // Créer le PDF
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    
                    const imgWidth = 210; // Largeur A4
                    const pageHeight = 295; // Hauteur A4
                    const imgHeight = (optimizedCanvas.height*imgWidth)/optimizedCanvas.width;
                    
                    // Ajouter l'image au pdf
                    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, '', 'FAST');
                    
                    // Télécharger le PDF
                    const fileName = `Fiche_didentification_${new Date().toISOString().slice(0, 10)}.pdf`;
                    pdf.save(fileName);
                    
                    // Masquer l'indicateur de chargement
                    loadingIndicator.style.display = 'none';
                }).catch(error => {
                    console.error('Erreur lors de la génération du PDF:', error);
                    alert('Une erreur est survenue lors de la génération du PDF.');
                    loadingIndicator.style.display = 'none';
                    //rétablir la transformation en cas d'erreur
                    documentContainer.style.transform = originalScale;
                    documentConst.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                });
            }, 200);
            });
            
            function optimizeCanvasQuality(canvas){
                //créer un nouveau canvas avec la même taille
                const optimizedCanvas = document.createElement('canvas');
                optimizedCanvas.width = canvas.width;
                optimizedCanvas.height = canvas.height;

                const ctx = optimizedCanvas.getContext('2d');

                //application des paramètres de qualité maximale
                ctx.imageSmoothingEnabled = false;
                ctx.webkitImageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;
                ctx.msImageSmoothingEnabled = false;

                //dessiner l'image originale
                ctx.drawImage(canvas, 0, 0);

                return optimizedCanvas;
            }
            // Gestion du bouton modifier
            const editBtn = document.getElementById('editBtn');
            editBtn.addEventListener('click', function() {
                // Masquer le document et le message de succès
                documentContainer.style.display = 'none';
                successMessage.style.display = 'none';
                
                // Défilement vers le formulaire
                document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
            });
        });