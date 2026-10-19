package fontys.individual.controller;

import fontys.individual.business.interfaces.PaintingManager;
import fontys.individual.domain.classes.Painting;
import fontys.individual.domain.requests.painting.CreatePaintingRequest;
import fontys.individual.domain.requests.painting.UpdatePaintingRequest;
import fontys.individual.domain.responses.painting.CreatePaintingResponse;
import fontys.individual.domain.responses.painting.GetAllPaintingsResponse;
import fontys.individual.domain.responses.painting.GetPaintingResponse;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173"})
@RestController
@RequestMapping("/paintings")
@AllArgsConstructor
public class ArtController {

    private final PaintingManager paintingManager;

    //@RolesAllowed({"ADMIN", "CUSTOMER"})
    @GetMapping
    public ResponseEntity<GetAllPaintingsResponse> getAllPaintings()
    {
        List<Painting> allPaintings = paintingManager.getAllPaintings();
        GetAllPaintingsResponse response = GetAllPaintingsResponse.builder().paintings(allPaintings).build();
        return ResponseEntity.ok(response);
    }


    @RolesAllowed({"CUSTOMER", "ADMIN"})
    @GetMapping("{id}")
    public ResponseEntity<GetPaintingResponse> getPaintingById(@PathVariable ("id") long id)
    {
        Painting painting = paintingManager.getPaintingById(id);
        if (painting == null)
        {
            return ResponseEntity.notFound().build();
        }
        else
        {
            GetPaintingResponse response = GetPaintingResponse.builder().painting(painting).build();
            return ResponseEntity.ok(response);
        }
    }

    @RolesAllowed({"ADMIN"})
    @PostMapping
    public ResponseEntity<CreatePaintingResponse> createPainting(@RequestBody @Valid CreatePaintingRequest request)
    {
        Painting painting = new Painting(0L, request.getPrice(), request.getDescription(), request.getName(), request.getLength(), request.getWidth(), request.getImage(), 0, 0);
        Long id = paintingManager.createPainting(painting);
        CreatePaintingResponse response = CreatePaintingResponse.builder().id(id).name(request.getName()).price(request.getPrice()).build();
        return ResponseEntity.ok(response);
    }

    @RolesAllowed({"ADMIN"})
    @PutMapping("{id}")
    public ResponseEntity<Void> updatePainting(@PathVariable ("id") long id, @RequestBody @Valid UpdatePaintingRequest request)
    {
        if (paintingManager.getPaintingById(id) == null)
        {
            return ResponseEntity.notFound().build();
        }
        else
        {
            Painting painting = Painting.builder().id(id).price(request.getPrice()).name(request.getName()).length(request.getLength()).width(request.getWidth()).image(request.getImage()).auction(request.getAuction()).sold(request.getSold()).build();
            paintingManager.updatePainting(id, painting);
            return ResponseEntity.noContent().build();
        }
    }

    @RolesAllowed({"ADMIN"})
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deletePainting(@PathVariable ("id") long id)
    {
        if (paintingManager.getPaintingById(id) == null)
        {
            return ResponseEntity.notFound().build();
        }
        else
        {
            paintingManager.deletePainting(id);
            return ResponseEntity.noContent().build();
        }
    }
}
