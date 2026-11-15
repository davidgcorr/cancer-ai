import bpy, sys
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
source=args[0] if args else '/tmp/oncoatlas-z-visceral.glb'
output=args[1] if len(args)>1 else '/tmp/oncoatlas-z-selected.glb'
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=source)
bpy.ops.object.select_all(action='DESELECT')
selected=[]
for obj in bpy.data.objects:
    name=obj.get('za_name',obj.name)
    if obj.type=='MESH' and ('lobe of' in name and 'lung' in name or name in ['Thyroid gland','Liver','Heart','Trachea','Larynx','Esophagus']):
        selected.append(obj)
        print('SOURCE',name)
for obj in selected: obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=output,use_selection=True,export_extras=True,export_draco_mesh_compression_enable=False)
