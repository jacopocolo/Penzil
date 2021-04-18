# https://blender.stackexchange.com/questions/166952/adding-a-new-material-to-a-grease-pencil
# https://docs.blender.org/api/current/bpy.ops.gpencil.html

import bpy
import json

with open(r'../../../../Users/jcolo/Downloads/gp_ultra.json', 'r') as f:
    print(f)
    j = json.load(f)


def get_grease_pencil(gpencil_obj_name='GPencil') -> bpy.types.GreasePencil:
    """
    Return the grease-pencil object with the given name. Initialize one if not already present.
    :param gpencil_obj_name: name/key of the grease pencil object in the scene
    """

    # If not present already, create grease pencil object
    if gpencil_obj_name not in bpy.context.scene.objects:
        bpy.ops.object.gpencil_add(location=(0, 0, 0), type='EMPTY')
        # rename grease pencil
        bpy.context.scene.objects[-1].name = gpencil_obj_name

    # Get grease pencil object
    gpencil = bpy.context.scene.objects[gpencil_obj_name]
    gpencil.data.stroke_depth_order = '3D'

    return gpencil


def get_grease_pencil_layer(gpencil: bpy.types.GreasePencil, gpencil_layer_name='GP_Layer',
                            clear_layer=False) -> bpy.types.GPencilLayer:
    """
    Return the grease-pencil layer with the given name. Create one if not already present.
    :param gpencil: grease-pencil object for the layer data
    :param gpencil_layer_name: name/key of the grease pencil layer
    :param clear_layer: whether to clear all previous layer data
    """

    # Get grease pencil layer or create one if none exists
    if gpencil.data.layers and gpencil_layer_name in gpencil.data.layers:
        gpencil_layer = gpencil.data.layers[gpencil_layer_name]
    else:
        gpencil_layer = gpencil.data.layers.new(
            gpencil_layer_name, set_active=True)

    if clear_layer:
        gpencil_layer.clear()  # clear all previous layer data

    # bpy.ops.gpencil.paintmode_toggle()  # need to trigger otherwise there is no frame

    return gpencil_layer

# Util for default behavior merging previous two methods


def init_grease_pencil(gpencil_obj_name='GPencil', gpencil_layer_name='GP_Layer',
                       clear_layer=True) -> bpy.types.GPencilLayer:
    gpencil = get_grease_pencil(gpencil_obj_name)

    gpencil_layer = get_grease_pencil_layer(
        gpencil, gpencil_layer_name, clear_layer=clear_layer)
    return gpencil_layer


def draw_line(gp_frame, p0, index):

    # Init new stroke
    gp_stroke = gp_frame.strokes.new()
    mat = bpy.data.materials.new(name="Penzilmaterial")
    bpy.data.materials.create_gpencil_data(mat)
    ob = bpy.context.active_object
    ob.data.materials.append(mat)

    if p0['stroke']['show_stroke'] == True:
        color = p0['stroke']['color'].lstrip('#')
        color = tuple(int(color[i:i+2], 16) for i in (0, 2, 4))
        r = color[0] / 255
        g = color[1] / 255
        b = color[2] / 255
        a = 1
        mat.grease_pencil.color = (r, g, b, a)
    else:
        mat.grease_pencil.show_stroke = False

    if p0['fill']['show_fill'] == True:
        fillcolor = p0['fill']['color'].lstrip('#')
        fillcolor = tuple(int(fillcolor[i:i+2], 16) for i in (0, 2, 4))
        fr = fillcolor[0] / 255
        fg = fillcolor[1] / 255
        fb = fillcolor[2] / 255
        fa = 1
        mat.grease_pencil.fill_color = (fr, fg, fb, fa)
        mat.grease_pencil.show_fill = True
        # bpy.ops.gpencil.stroke_arrange(direction='BOTTOM')
    else:
        mat.grease_pencil.show_fill = False

    gp_stroke.material_index = index
    gp_stroke.line_width = p0["stroke"]["lineWidth"] * 10000
    gp_stroke.display_mode = '3DSPACE'  # allows for editing

    # Define stroke geometry
    vertices = p0['vertices']
    length = len(vertices)/3
    forceLength = len(p0["stroke"]["force"])
    gp_stroke.points.add(count=length)

    i = 0
    l = 0
    while i < length*3:
        gp_stroke.points[l].co = (vertices[i], -vertices[i+2], vertices[i+1])
        l += 1
        i += 3

    return gp_stroke


gp_layer = init_grease_pencil()
gp_frame = gp_layer.frames.new(0)

p = 0
while p < len(j):
    draw_line(gp_frame, j[p], p)
    p += 1
