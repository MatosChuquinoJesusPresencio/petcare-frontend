export default function MascotaForm() {
  return (
    <form>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Nombre</label>

          <input type="text" className="form-control" />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Especie</label>

          <input type="text" className="form-control" />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Raza</label>

          <input type="text" className="form-control" />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Sexo</label>

          <select className="form-select">
            <option>MACHO</option>
            <option>HEMBRA</option>
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary">
          Cancelar
        </button>

        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </div>
    </form>
  );
}
