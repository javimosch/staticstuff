

###Como agregar un proyecto

Imaginate que queres  agregar toda una pagina de un proyecto en una categoria
de proyectos, por ejemplo, Branding.
**Lo primero** que tenes que hacer es crear un archivo para representar esa pagina
del proyecto.
El archivo deberia llamarse algo asi como 'index-rich-work-NOMBRE-DEL-PROYECTO.html'
y deberia estar en src/partials/rich/work-single
Para el contenido del archivo usar como ejemplo otro que ya exista.
**El segundo paso** es linkear ese proyecto con un thumbnail en la pagina de branding,
que este caso es rich.projects-branding.html y se encuentra en 
src/partials/rich/work-categories
Revisando el archivo es facil darse cuenta el codigo que representa un thumbnail 
y se puede duplicar uno existente y de esta forma agregarlo por analogia.

**El tercer paso** es probarlo, al ingresar en Projects, Branding, deberias ver el thumbnail
de tu nuevo projecto. Pero cual es el enlace ????

**Cuarto paso**, crear un archivo estatico que representa dicho archivo del proyecto,
se crea en static/rich/projects/
 - Una carpeta en minuscula sin espacios que indique el nombre del proyecto
 - un archivo dentro estilo 'index-rich-work-NOMBRE-PROYECTO.html'
Ex: deberia quedar algo como src/static/rich/projects/vacuum/index.rich-work-vacuum.html

**Quinto y ultimo paso**: Ir al thumbnail del segundo paso y al link (a href) indicarle
el path que acabamos de crear. Ex: {{root}}projects/vacuum

LISTO EL POLLO!
